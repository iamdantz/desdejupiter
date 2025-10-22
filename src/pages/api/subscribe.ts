export const prerender = false;

import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return new Response(
        JSON.stringify({ error: 'Email inválido' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const substackResponse = await fetch(
      'https://desdejupiter.substack.com/api/v1/free',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (compatible; DesdejupiterBot/1.0)',
        },
        body: JSON.stringify({
          email: email,
          first_url: 'https://desdejupiter.me',
        }),
      }
    );

    const responseData = await substackResponse.text();

    if (!substackResponse.ok) {
      console.error('Substack error:', substackResponse.status, responseData);

      if (responseData.includes('already subscribed') || responseData.includes('ya suscrito')) {
        return new Response(
          JSON.stringify({ success: true, message: 'Ya estás suscrito' }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`Substack respondió con status ${substackResponse.status}`);
    }

    return new Response(
      JSON.stringify({ success: true }),
      { 
        status: 200, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error en suscripción:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Error al procesar la suscripción. Intenta nuevamente.' 
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
