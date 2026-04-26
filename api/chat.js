// v4 - RAG with Pinecone
import https from 'https';

function makeRequest(hostname, path, method, headers, body) {
  return new Promise((resolve, reject) => {
    const options = { hostname, path, method, headers };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, data: JSON.parse(data) }); }
        catch(e) { resolve({ status: res.statusCode, data }); }
      });
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

async function getQueryEmbedding(text, anthropicKey) {
  const body = JSON.stringify({
    model: 'voyage-3',
    input: [text],
    input_type: 'query'
  });
  const res = await makeRequest(
    'api.voyageai.com',
    '/v1/embeddings',
    'POST',
    {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${anthropicKey}`,
      'Content-Length': Buffer.byteLength(body)
    },
    body
  );
  return res.data.data?.[0]?.embedding || null;
}

async function queryPinecone(embedding, pineconeKey, pineconeHost) {
  const host = pineconeHost.replace('https://', '');
  const body = JSON.stringify({
    vector: embedding,
    topK: 8,
    includeMetadata: true
  });
  const res = await makeRequest(
    host,
    '/query',
    'POST',
    {
      'Content-Type': 'application/json',
      'Api-Key': pineconeKey,
      'Content-Length': Buffer.byteLength(body)
    },
    body
  );
  return res.data.matches || [];
}

async function callAnthropic(messages, system, anthropicKey) {
  const body = JSON.stringify({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1024,
    system,
    messages
  });
  const res = await makeRequest(
    'api.anthropic.com',
    '/v1/messages',
    'POST',
    {
      'Content-Type': 'application/json',
      'x-api-key': anthropicKey,
      'anthropic-version': '2023-06-01',
      'Content-Length': Buffer.byteLength(body)
    },
    body
  );
  return res;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  const pineconeKey = process.env.PINECONE_API_KEY;
  const pineconeHost = process.env.PINECONE_HOST;

  if (!anthropicKey) return res.status(500).json({ error: 'ANTHROPIC_API_KEY not set' });

  const { messages, system } = req.body;
  const lastMessage = messages[messages.length - 1]?.content || '';

  let ragContext = '';
  let sources = [];

  // Only do RAG if Pinecone is configured
  if (pineconeKey && pineconeHost) {
    try {
      const embedding = await getQueryEmbedding(lastMessage, anthropicKey);
      if (embedding) {
        const matches = await queryPinecone(embedding, pineconeKey, pineconeHost);
        if (matches.length > 0) {
          ragContext = matches.map(m => `=== ${m.metadata.fileName} ===\n${m.metadata.text}`).join('\n\n');
          sources = [...new Set(matches.map(m => m.metadata.fileName))];
        }
      }
    } catch(e) {
      console.error('RAG error:', e.message);
    }
  }

  const finalSystem = system + (ragContext
    ? `\n\nRelevant documents from Young Mu knowledge base:\n${ragContext}`
    : '\n\nNo documents found in knowledge base for this query.');

  try {
    const response = await callAnthropic(messages, finalSystem, anthropicKey);
    if (!response.data.content) {
      return res.status(500).json({ error: response.data.error?.message || 'Anthropic error', sources });
    }
    return res.status(200).json({ ...response.data, sources });
  } catch(e) {
    return res.status(500).json({ error: e.message });
  }
}
