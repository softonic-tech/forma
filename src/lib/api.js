export async function api(path, { method = 'GET', body, headers } = {}) {
  const isForm = typeof FormData !== 'undefined' && body instanceof FormData;
  const res = await fetch(path, {
    method,
    credentials: 'include',
    headers: isForm ? headers : { 'Content-Type': 'application/json', ...(headers || {}) },
    body: body == null ? undefined : isForm ? body : JSON.stringify(body)
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}
