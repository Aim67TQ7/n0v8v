import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, subject, html } = await req.json();

    // Log the request for debugging
    console.log("Sending email to:", to);
    console.log("Subject:", subject);

    // In development/test mode, only allow sending to the verified email
    const VERIFIED_EMAIL = "robert.clausing@gmail.com";
    const toAddresses = Array.isArray(to) ? to : [to];
    
    // Check if we're trying to send to unverified emails
    if (!toAddresses.every(email => email === VERIFIED_EMAIL)) {
      console.log("Attempting to send to unverified email. In test mode, can only send to:", VERIFIED_EMAIL);
      return new Response(
        JSON.stringify({
          error: "In test mode, you can only send emails to your verified email address. Please verify your domain at resend.com/domains"
        }),
        {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
      },
      body: JSON.stringify({
        from: "Company GPT <onboarding@resend.dev>",
        to: toAddresses,
        subject,
        html,
      }),
    });

    if (!res.ok) {
      const error = await res.text();
      console.error("Resend API error:", error);
      throw new Error(`Failed to send email: ${error}`);
    }

    const data = await res.json();
    console.log("Email sent successfully:", data);

    return new Response(JSON.stringify({ message: 'Email sent successfully' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Error sending email:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});