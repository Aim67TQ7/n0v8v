import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { Document } from "https://esm.sh/@langchain/core/documents";
import { OpenAIEmbeddings } from "https://esm.sh/@langchain/openai";
import { SupabaseVectorStore } from "https://esm.sh/@langchain/community/vectorstores/supabase";

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

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Download the file from storage
    console.log('Downloading file from storage...');
    const { data: fileData, error: downloadError } = await supabase
      .storage
      .from('rag-documents')
      .download(filePath);

    if (downloadError) {
      console.error('Error downloading file:', downloadError);
      throw downloadError;
    }

    // Convert file to text
    console.log('Converting file to text...');
    const text = await fileData.text();

    // Create document
    const doc = new Document({
      pageContent: text,
      metadata: {
        company_id: companyId,
        source: filePath,
      },
    });

    // Initialize OpenAI embeddings
    console.log('Initializing OpenAI embeddings...');
    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: Deno.env.get('OPENAI_API_KEY'),
    });

    // Store embeddings in Supabase
    console.log('Storing embeddings in Supabase...');
    await SupabaseVectorStore.fromDocuments(
      [doc],
      embeddings,
      {
        client: supabase,
        tableName: 'document_embeddings',
        queryName: 'match_documents',
      }
    );

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