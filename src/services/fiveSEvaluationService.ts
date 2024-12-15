import { supabase } from "@/integrations/supabase/client";

export const uploadImages = async (files: File[]) => {
  const uploadedUrls = [];
  
  for (const file of files) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('five-s-images')
      .upload(fileName, file);
      
    if (error) throw error;
    
    const { data: { publicUrl } } = supabase.storage
      .from('five-s-images')
      .getPublicUrl(fileName);
      
    uploadedUrls.push(publicUrl);
  }
  
  return uploadedUrls;
};

export const analyzeImages = async (imageUrls: string[]) => {
  // Convert image URLs to base64
  const base64Images = await Promise.all(
    imageUrls.map(async (url) => {
      const response = await fetch(url);
      const blob = await response.blob();
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result as string;
          const base64Data = base64String.split(',')[1];
          resolve(base64Data);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    })
  );

  // Get basic 5S analysis
  const { data: basicAnalysis, error: basicError } = await supabase.functions.invoke('analyze-5s-images', {
    body: { imageUrls: base64Images }
  });

  if (basicError) {
    console.error('Basic analysis error:', basicError);
    throw new Error('Failed to analyze images');
  }

  // Get detailed analysis
  const { data: detailedAnalysis, error: detailedError } = await supabase.functions.invoke('analyze-5s-detailed', {
    body: { imageUrls: base64Images }
  });

  if (detailedError) {
    console.error('Detailed analysis error:', detailedError);
    throw new Error('Failed to get detailed analysis');
  }

  return {
    ...basicAnalysis,
    detailedAnalysis
  };
};

export const createEvaluation = async (workcenter_id: string, analysis: any) => {
  // First verify that the user has a valid session and profile
  const { data: { user }, error: sessionError } = await supabase.auth.getUser();
  if (sessionError) throw sessionError;
  
  if (!user?.id) {
    throw new Error('No authenticated user found');
  }

  // Verify the user has a profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', user.id)
    .single();

  if (profileError || !profile) {
    throw new Error('User profile not found. Please ensure you are properly logged in.');
  }

  const { data: evaluation, error: evalError } = await supabase
    .from('five_s_evaluations')
    .insert({
      workcenter_id,
      created_by: user.id,
      sort_score: analysis.sort_score,
      set_in_order_score: analysis.set_in_order_score,
      shine_score: analysis.shine_score,
      standardize_score: analysis.standardize_score,
      sustain_score: analysis.sustain_score,
      strengths: analysis.strengths,
      weaknesses: analysis.weaknesses,
      opportunities: analysis.opportunities,
      threats: analysis.threats,
      safety_deduction: analysis.safety_deduction || 0
    })
    .select()
    .single();
    
  if (evalError) throw evalError;
  return evaluation;
};

export const saveImageReferences = async (evaluation_id: string, imageUrls: string[]) => {
  const imagePromises = imageUrls.map(url => 
    supabase
      .from('evaluation_images')
      .insert({
        evaluation_id,
        image_url: url,
        image_type: 'evaluation'
      })
  );
  
  await Promise.all(imagePromises);
};

export const saveTrainingData = async (
  evaluationId: string,
  feedback: string,
  imageUrls: string[],
  analysis: {
    strengths: string[];
    weaknesses: string[];
    scores: {
      sort?: number;
      set?: number;
      shine?: number;
    };
  }
) => {
  try {
    // Save feedback to the database
    const { error: feedbackError } = await supabase
      .from('five_s_learning_feedback')
      .insert({
        evaluation_id: evaluationId,
        feedback,
        created_by: (await supabase.auth.getUser()).data.user?.id
      });

    if (feedbackError) throw feedbackError;

    // Create a JSON file with the training data
    const trainingData = {
      evaluationId,
      feedback,
      imageUrls,
      analysis,
      timestamp: new Date().toISOString(),
      userId: (await supabase.auth.getUser()).data.user?.id
    };

    const fileName = `${evaluationId}-${Date.now()}.json`;
    const { error: uploadError } = await supabase.storage
      .from('Knowledge')
      .upload(`5s-training/${fileName}`, JSON.stringify(trainingData, null, 2));

    if (uploadError) throw uploadError;

  } catch (error) {
    console.error('Error saving training data:', error);
    throw error;
  }
};
