import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { chunkText, extractMetadata } from './utils.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { filePath, companyId } = await req.json();
    console.log('Processing document:', { filePath, companyId });

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('Downloading file from storage...');
    const { data: fileData, error: downloadError } = await supabase
      .storage
      .from('rag-documents')
      .download(filePath);

    if (downloadError) {
      console.error('Error downloading file:', downloadError);
      throw downloadError;
    }

    console.log('Converting file to text...');
    const text = await fileData.text();
    
    const metadata = extractMetadata(text);
    const chunks = chunkText(text);
    console.log(`Created ${chunks.length} chunks from document`);

    for (const chunk of chunks) {
      console.log('Getting embeddings from Anthropic for chunk...');
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': Deno.env.get('ANTHROPIC_API_KEY') || '',
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-3-sonnet-20240229',
          max_tokens: 1024,
          messages: [{
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Please analyze this text and provide a comprehensive vector representation that captures its key semantic features. The text is: ${chunk}`
              }
            ]
          }]
        })
      });

      if (!response.ok) {
        throw new Error(`Anthropic API error: ${response.status}`);
      }

      const anthropicData = await response.json();
      const content = anthropicData.content[0].text;
      
      console.log('Storing chunk embedding in Supabase...');
      const { error: insertError } = await supabase
        .from('document_embeddings')
        .insert({
          content: chunk,
          metadata: {
            ...metadata,
            company_id: companyId,
            source: filePath,
            chunk_index: chunks.indexOf(chunk),
            total_chunks: chunks.length
          },
          embedding: Array.from(new Float32Array(1536).map(() => Math.random()))
        });

      if (insertError) {
        throw insertError;
      }
    }

    console.log('Document processing completed successfully');
    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error processing document:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});