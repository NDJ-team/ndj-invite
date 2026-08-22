const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface FetchOptions extends RequestInit {
  json?: unknown;
}

async function request<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const { json, ...fetchOptions } = options;
  const headers: Record<string, string> = {
    ...(fetchOptions.headers as Record<string, string>),
  };
  if (json) {
    headers["Content-Type"] = "application/json";
    fetchOptions.body = JSON.stringify(json);
  }
  const res = await fetch(`${API_URL}${path}`, {
    ...fetchOptions,
    headers,
    credentials: "include",
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: "Request failed" }));
    throw new Error(error.detail || `HTTP ${res.status}`);
  }
  return res.json();
}

export const api = {
  auth: {
    login: (email: string, password: string) =>
      request<{ access_token: string }>("/api/auth/login", { json: { email, password }, method: "POST" }),
    logout: () => request("/api/auth/logout", { method: "POST" }),
    me: () => request<{ id: string; name: string; email: string }>("/api/auth/me"),
  },
  invitations: {
    list: () => request<any[]>("/api/invitations/"),
    get: (id: string) => request<any>(`/api/invitations/${id}`),
    create: (data: any) => request<any>("/api/invitations/", { json: data, method: "POST" }),
    update: (id: string, data: any) => request<any>(`/api/invitations/${id}`, { json: data, method: "PUT" }),
    delete: (id: string) => request(`/api/invitations/${id}`, { method: "DELETE" }),
    publish: (id: string) => request<any>(`/api/invitations/${id}/publish`, { method: "POST" }),
    archive: (id: string) => request<any>(`/api/invitations/${id}/archive`, { method: "POST" }),
  },
  photos: {
    upload: async (invitationId: string, file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch(`${API_URL}/api/invitations/${invitationId}/photos`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      if (!res.ok) throw new Error("Upload failed");
      return res.json();
    },
    delete: (id: string) => request(`/api/photos/${id}`, { method: "DELETE" }),
  },
  guests: {
    list: (invitationId: string) => request<any[]>(`/api/invitations/${invitationId}/guests`),
    stats: (invitationId: string) => request<any>(`/api/invitations/${invitationId}/guests/stats`),
    update: (id: string, data: any) => request<any>(`/api/guests/${id}`, { json: data, method: "PUT" }),
    delete: (id: string) => request(`/api/guests/${id}`, { method: "DELETE" }),
  },
  public: {
    get: (slug: string) => request<any>(`/api/public/invitations/${slug}`),
    photos: (slug: string) => request<any[]>(`/api/public/invitations/${slug}/photos`),
    rsvp: (slug: string, data: any) =>
      request<{ success: boolean; message: string }>(`/api/public/invitations/${slug}/rsvp`, { json: data, method: "POST" }),
  },
};
