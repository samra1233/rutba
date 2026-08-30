export async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(endpoint, {
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {})
    },
    ...options
  });

  if (!response.ok) {
    let errorMessage = `API Request failed with status ${response.status}`;
    try {
      const errorData = await response.json();
      if (errorData?.error) errorMessage = errorData.error;
    } catch (_) {}
    throw new Error(errorMessage);
  }

  return response.json();
}
