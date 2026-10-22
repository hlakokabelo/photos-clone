import type { Photo, PhotoFilters, PhotoResponse } from "../types/photo.ts";
import { request } from "./apiClient";

export function uploadPhoto(data: string) {
  return request<Photo>("/api/photo", {
    method: "POST",
    body: JSON.stringify({ data }),
  });
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
