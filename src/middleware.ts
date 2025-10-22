import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async ({ request, locals }, next) => {
  const url = new URL(request.url);

  if (import.meta.env.DEV && url.pathname.startsWith('/substack-proxy')) {
    const substackPath = url.pathname.replace('/substack-proxy', '');
    const substackUrl = `https://desdejupiter.substack.com${substackPath}`;

    const response = await fetch(substackUrl, {
      method: request.method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/plain, */*',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
        'Origin': 'https://desdejupiter.substack.com',
        'Referer': 'https://desdejupiter.substack.com/subscribe',
      },
      body: request.method !== 'GET' ? await request.text() : undefined,
    });

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    });
  }

  return next();
});
