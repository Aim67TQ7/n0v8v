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
          // Remove the data URL prefix
          const base64Data = base64String.split(',')[1];
          resolve(base64Data);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    })
  );

  const { data, error } = await supabase.functions.invoke('analyze-5s-images', {
    body: { imageUrls: base64Images }
  });

  if (error) {
    console.error('Analysis error:', error);
    throw new Error('Failed to analyze images');
  }

  return data;
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