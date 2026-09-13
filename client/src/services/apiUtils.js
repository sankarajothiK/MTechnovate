/**
 * Safe API fetch helper for static deployments (e.g. Vercel)
 * Prevents "Unexpected end of JSON input" SyntaxErrors when endpoints return HTML (SPA rewrites)
 */

export async function safeFetchJson(url, options = {}, defaultData = null) {
  try {
    const res = await fetch(url, options);
    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      console.warn(`[SafeFetch] ${url} returned non-JSON response (${contentType || 'empty'}). Using fallback.`);
      return defaultData !== null ? defaultData : { success: false, message: 'Endpoint unavailable on static hosting' };
    }
    const data = await res.json();
    return data;
  } catch (err) {
    console.warn(`[SafeFetch] Fetch error for ${url}:`, err.message);
    return defaultData !== null ? defaultData : { success: false, message: err.message };
  }
}
