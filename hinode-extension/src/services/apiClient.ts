import type { HomePayload } from '../types/api';

/**
 * Fetches the home payload from the backend server.
 * Uses absolute URL pointing to the local development server (port 7000).
 */
export async function getHomePayload(): Promise<HomePayload> {
  const response = await fetch('http://localhost:7000/api/home');
  if (!response.ok) {
    throw new Error(`Failed to fetch home payload: ${response.status}`);
  }
  const data = (await response.json()) as HomePayload;
  return data;
}
