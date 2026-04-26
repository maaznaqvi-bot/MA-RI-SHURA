// v3
import https from 'https';

export default async function handler(req, res) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  
  // Debug: log all env vars starting with ANTHROPIC
  const envKeys = Object.keys(process.env).filter(k => k.includes('ANTHROPIC'));
  console.log('ANTHROPIC env keys found:', envKeys);
  console.log('API key exists:', !!apiKey);
  console.log('API key prefix:', apiKey ? apiKey.substring(0, 10) : 'NONE');

  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method not allowed',
      debug: { envKeys, hasKey: !!apiKey }
    });
  }

  if (!apiKey) {
    return res.status(500).json({ 
      error: 'ANTHROPIC_API_KEY environment variable not set',
      debug: { envKeys, allKeys: Object.keys(process.env).slice(0, 20) }
    });
  }

  const body = JSON.stringify(req.body);

  const options = {
    hostname: 'api.anthropic.com',
    path: '/v1/messages',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(body),
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    }
  };

  return new Promise((resolve) => {
    const request = https.request(options, (response) => {
      let data = '';
      response.on('data', (chunk) => { data += chunk; });
      response.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          res.status(response.statusCode).json(parsed);
        } catch (e) {
          res.status(500).json({ error: 'Failed to parse Anthropic response' });
        }
        resolve();
      });
    });

    request.on('error', (error) => {
      res.status(500).json({ error: error.message });
      resolve();
    });

    request.write(body);
    request.end();
  });
}
