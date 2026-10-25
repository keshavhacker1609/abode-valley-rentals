// Client helper: POST JSON to one of our form endpoints and surface a readable error.
export async function submitForm(endpoint: string, data: unknown) {
  const res = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error ?? "Something went wrong. Please call or WhatsApp us instead.");
  return body;
}
