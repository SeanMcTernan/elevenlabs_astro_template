import type { Context } from "@netlify/functions";

export default async (req: Request, context: Context) => {
    // Only allow GET requests
    if (req.method !== 'GET') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
            status: 405,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    if (!process.env.AGENT_ID || !process.env.ELEVENLABS_API_KEY) {
        return new Response(JSON.stringify({ error: 'Missing required environment variables' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    try {
        const url = new URL('https://api.elevenlabs.io/v1/convai/conversation/get-signed-url');
        url.searchParams.append('agent_id', process.env.AGENT_ID);

        const response = await fetch(url, {
            headers: {
                'xi-api-key': process.env.ELEVENLABS_API_KEY
            }
        });

        if (!response.ok) {
            throw new Error(`ElevenLabs API error: ${response.statusText}`);
        }

        const data = await response.json();
        return new Response(JSON.stringify({ signedUrl: data.signed_url }), {
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache'
            }
        });
    } catch (error) {
        console.error('Error getting signed URL:', error);
        return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
};

export const config = {
    path: "/api/agent"
};