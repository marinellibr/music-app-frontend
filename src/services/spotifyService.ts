let cachedToken: string | null = null;
let tokenExpiration = 0;

const BACKEND_BASE =
  process.env.REACT_APP_ENDPOINT_API || "http://localhost:3000";

async function requestNewToken(): Promise<string> {
  const response = await fetch(`${BACKEND_BASE}/spotify/token`);
  const data = await response.json();
  cachedToken = data.access_token;
  tokenExpiration = Date.now() + data.expires_in * 1000;
  return cachedToken!;
}

async function getValidToken(): Promise<string> {
  const now = Date.now();
  if (cachedToken && now < tokenExpiration) return cachedToken;
  return await requestNewToken();
}

async function apiFetch<T>(endpoint: string): Promise<T> {
  const token = await getValidToken();

  const response = await fetch(`https://api.spotify.com/v1/${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error?.message || "Erro ao acessar a API do Spotify");
  }

  return response.json();
}

export async function init() {
  await getValidToken();
}

export async function search<T>(
  query: string,
  types: string | string[] = ["track", "album", "artist"]
): Promise<T> {
  const typeString = Array.isArray(types) ? types.join(",") : types;
  const params = `q=${encodeURIComponent(query)}&type=${typeString}&limit=10`;
  return apiFetch<T>(`search?${params}`);
}

export async function getTrackById(id: string) {
  return apiFetch(`tracks/${id}`);
}

export async function getAlbumById(id: string) {
  return apiFetch(`albums/${id}`);
}

export default {
  init,
  search,
  getTrackById,
  getAlbumById,
};
