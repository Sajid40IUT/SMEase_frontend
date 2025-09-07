const rawApiBaseUrl = (import.meta as any).env?.VITE_API_URL || '/api';
// Normalize: remove trailing slashes to avoid double slashes when joining paths
const API_BASE_URL = String(rawApiBaseUrl).replace(/\/+$/, '');

export const config = {
  API_BASE_URL,
};
