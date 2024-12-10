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
  const response = await supabase.functions.invoke('analyze-5s-images', {
    body: { imageUrls }
  });

  if (response.error) {
    throw new Error('Failed to analyze images');
  }

  return response.data;
};

export const createEvaluation = async (workcenter_id: string, analysis: any) => {
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  if (sessionError) throw sessionError;
  
  if (!session?.user?.id) {
    throw new Error('No authenticated user found');
  }

  const { data: evaluation, error: evalError } = await supabase
    .from('five_s_evaluations')
    .insert({
      workcenter_id,
      created_by: session.user.id,
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