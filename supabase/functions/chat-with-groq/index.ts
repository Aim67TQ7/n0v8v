import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    
    console.log('Attempting to use Anthropic API with Haiku model...');
    
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
        'anthropic-stream': 'true'
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        messages: messages.map(msg => ({
          role: msg.role === 'assistant' ? 'assistant' : 'user',
          content: msg.content
        })),
        max_tokens: 1024,
        stream: true
      }),
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.status}`);
    }

    // Create a TransformStream to process the response
    const stream = new TransformStream({
      async transform(chunk, controller) {
        try {
          const text = new TextDecoder().decode(chunk);
          const lines = text.split('\n').filter(line => line.trim() !== '');
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') return;
              
              try {
                const parsed = JSON.parse(data);
                if (parsed.type === 'message_stop') continue;
                
                if (parsed.type === 'content_block_delta' && parsed.delta?.text) {
                  const chunk = {
                    choices: [{
                      delta: {
                        content: parsed.delta.text
                      }
                    }]
                  };
                  controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify(chunk)}\n\n`));
                }
              } catch (e) {
                console.error('Error parsing JSON:', e);
              }
            }
          }
        } catch (error) {
          console.error('Error in transform:', error);
        }
      }
    });

    return new Response(response.body?.pipeThrough(stream), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      }
    });
  } catch (error) {
    console.error('Error in chat-with-groq function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      message: "Failed to process request. Please try again in a moment."
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});