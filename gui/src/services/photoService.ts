import type { Photo, PhotoFilters, PhotoResponse } from "../types/photo.ts";
import { getApiUrl, request } from "./apiClient";

import { getToken } from "../lib/tokenStore";

export async function uploadPhoto(file: File): Promise<Photo> {
  const headers = new Headers();
  const token = getToken();

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const formData = new FormData();
  formData.append("data", file);

  const response = await fetch(getApiUrl("/api/photo"), {
    method: "POST",
    headers,
    body: formData,
  });

  if (!response.ok) {
    const message = await response.text().catch(() => "");
    throw new Error(message || `Upload failed (${response.status})`);
  }

  return response.json() as Promise<Photo>;
}

export async function listPhotos(
  filters: PhotoFilters,
): Promise<PhotoResponse[]> {
  const query = new URLSearchParams();

  if (filters.fileName?.trim()) {
    query.set("fileName", filters.fileName.trim());
  }

  if (filters.contentType?.trim()) {
    query.set("contentType", filters.contentType.trim());
  }

  query.set("limit", String(filters.limit));

  const result = await request<PhotoResponse[] | { content?: PhotoResponse[] }>(
    `/api/photos?${query}`,
  );

  return Array.isArray(result) ? result : (result.content ?? []);
}

export function getPhoto(id: number) {
  return request<PhotoResponse>(`/api/photo/${id}`);
}

export function deletePhoto(id: number) {
  return request<void>(`/api/photo/${id}`, {
    method: "DELETE",
  });
}
