export const config = { runtime: 'edge' };

const SHEET_BASE = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTbXtkL4ry38KEg6MvKsED3gRhZRmNcU_El9yQY29kf9Uis7fjPyOW1ap9L64SYWhkheeBOuLufd1-K/pub';

export default async function handler(req) {
  const { searchParams } = new URL(req.url);
  const gid = searchParams.get('gid') || '0';

  const url = `${SHEET_BASE}?gid=${gid}&single=true&output=csv`;

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; YMShuraApp/1.0)',
      },
    });

    if (!res.ok) {
      return new Response(JSON.stringify({ error: `Sheet fetch failed: ${res.status}` }), {
        status: res.status,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }

    const csv = await res.text();

    return new Response(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }
}
