import type { APIRoute } from 'astro';

const BROWSERLESS_TOKEN = process.env.BROWSERLESS_TOKEN;
const SUBSTACK_BASE = 'https://desdejupiter.substack.com';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { email } = await request.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(
        JSON.stringify({ error: 'Email inválido' }), 
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const pageUrl = `${SUBSTACK_BASE}/subscribe`;
    const subscribeUrl = `${SUBSTACK_BASE}/api/v1/free`;

    const requestBody = {
      first_url: pageUrl,
      first_referrer: '',
      current_url: pageUrl,
      current_referrer: '',
      first_session_url: pageUrl,
      first_session_referrer: '',
      referral_code: '',
      source: 'subscribe_page',
      referring_pub_id: '',
      additional_referring_pub_ids: '',
      email: email,
    };

    const functionCode = `
export default async function ({ page }) {
  try {
    await page.goto('${pageUrl}', { waitUntil: 'networkidle2' });

    const response = await page.evaluate(async (body) => {
      const res = await fetch('${subscribeUrl}', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      });
      return res.json();
    }, ${JSON.stringify(requestBody)});
    
    return {
      data: response,
      type: 'application/json',
    };
  } catch (error) {
    return {
      error: error.message,
      type: 'application/json',
    };
  }
}
    `.trim();

    const browserlessUrl = `https://production-sfo.browserless.io/function?token=${BROWSERLESS_TOKEN}`;
    
    const browserlessResponse = await fetch(browserlessUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/javascript' },
      body: functionCode,
    });

    if (!browserlessResponse.ok) {
      const errorText = await browserlessResponse.text();
      console.error('Browserless API error:', browserlessResponse.status, errorText);
      return new Response(
        JSON.stringify({ 
          error: 'browserless_error', 
          details: `Browserless returned ${browserlessResponse.status}` 
        }), 
        { status: 502, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const result = await browserlessResponse.json();

    if (result.error) {
      console.error('Browser execution error:', result.error);
      return new Response(
        JSON.stringify({ error: 'execution_error', details: result.error }), 
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const substackResponse = result.data;
    
    if (substackResponse && substackResponse.error) {
      console.error('Substack API error:', substackResponse);
      return new Response(
        JSON.stringify({ 
          error: 'substack_error', 
          details: substackResponse 
        }), 
        { status: 502, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, data: substackResponse }), 
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (err) {
    console.error('Subscribe handler error:', err);
    return new Response(
      JSON.stringify({ 
        error: 'internal_error', 
        details: err instanceof Error ? err.message : String(err) 
      }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
