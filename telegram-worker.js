// Cloudflare Worker: Secure Telegram Proxy
export default {
  async fetch(request, env) {
    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Max-Age': '86400',
        },
      });
    }

    // Only allow POST requests
    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    try {
      // Parse the request body
      const { chatId, text, parseMode = 'HTML' } = await request.json();
      
      // Validate required fields
      if (!chatId || !text) {
        return new Response(JSON.stringify({ 
          error: 'Missing required fields: chatId and text are required' 
        }), {
          status: 400,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          },
        });
      }

      // Get bot token from environment variables
      const botToken = env.TELEGRAM_BOT_TOKEN;
      if (!botToken) {
        return new Response(JSON.stringify({ 
          error: 'Bot token not configured' 
        }), {
          status: 500,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          },
        });
      }

      // Telegram API URL
      const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
      
      // Forward request to Telegram
      const response = await fetch(telegramUrl, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'User-Agent': 'Tefera-Yadeta-Travel/1.0'
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: text,
          parse_mode: parseMode,
          disable_web_page_preview: true
        })
      });

      // Get Telegram's response
      const responseData = await response.json();
      
      // Return Telegram's response to client
      return new Response(JSON.stringify(responseData), {
        status: response.status,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'X-Worker-Proxy': 'Tefera-Travel-System'
        },
      });
      
    } catch (error) {
      console.error('Worker error:', error);
      
      return new Response(JSON.stringify({ 
        error: 'Internal server error',
        details: error.message 
      }), { 
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
      });
    }
  }
};

// Additional test endpoint (optional)
export async function handleTelegramWebhook(request, env) {
  if (request.method === 'POST') {
    const body = await request.json();
    
    // Store webhook data (optional)
    await env.TELEGRAM_WEBHOOK.put(`webhook_${Date.now()}`, JSON.stringify(body));
    
    return new Response(JSON.stringify({ ok: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }
  
  return new Response(JSON.stringify({ error: 'Method not allowed' }), {
    status: 405,
    headers: { 'Content-Type': 'application/json' },
  });
}