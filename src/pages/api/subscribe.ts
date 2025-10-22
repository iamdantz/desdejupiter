export const prerender = false;

import type { APIRoute } from 'astro';

const SUBSTACK_BASE = 'https://desdejupiter.substack.com';

async function fetchFollowRedirects(url: string, options: RequestInit = {}) {
  const maxRedirects = 5;
  let currentUrl = url;
  let redirects = 0;

  while (redirects <= maxRedirects) {
    const res = await fetch(currentUrl, { redirect: 'manual', ...options });

    if (res.status >= 300 && res.status < 400) {
      const location = res.headers.get('location');
      if (!location) return res;
      currentUrl = new URL(location, currentUrl).toString();
      redirects++;
      continue;
    }

    return res;
  }

  throw new Error('Too many redirects');
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const { email } = await request.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(JSON.stringify({ error: 'Email inválido' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const pageUrl = `${SUBSTACK_BASE}/subscribe`;

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

    const subscribeUrl = `${SUBSTACK_BASE}/api/v1/free`;

    const res = await fetchFollowRedirects(subscribeUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
        'Origin': SUBSTACK_BASE,
        'Referer': pageUrl,
        'Sec-CH-UA': '"Chromium";v="128", "Not;A=Brand";v="24", "Google Chrome";v="128"',
        'Sec-CH-UA-Mobile': '?0',
        'Sec-CH-UA-Platform': '"Windows"',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-origin',
        'DNT': '1',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
      },
      body: JSON.stringify(requestBody),
    });

    const contentType = res.headers.get('content-type') || '';

    if (contentType.includes('text/html')) {
      const text = await res.text();
      console.error('Substack returned HTML (possible block):', text.slice(0, 1000));
      
      return new Response(JSON.stringify({ error: 'blocked_by_cloudflare', details: 'Substack returned HTML response (blocked)' }), { status: 502, headers: { 'Content-Type': 'application/json' } });
    }

    const data = contentType.includes('application/json') ? await res.json() : await res.text();

    if (!res.ok) {
      console.error('Substack API error', res.status, data);
      return new Response(JSON.stringify({ error: 'substack_error', status: res.status, details: data }), { status: 502, headers: { 'Content-Type': 'application/json' } });
    }

    return new Response(JSON.stringify({ success: true, data }), { status: 200, headers: { 'Content-Type': 'application/json' } });

  } catch (err) {
    console.error('subscribe handler error', err);
    return new Response(JSON.stringify({ error: 'internal_error', details: err instanceof Error ? err.message : String(err) }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};
