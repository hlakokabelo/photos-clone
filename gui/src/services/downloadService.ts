import { getToken } from "../lib/tokenStore";
import { getApiUrl } from "./apiClient";

export async function downloadPhoto(
  id: number,
  fileName: string,
): Promise<void> {
  const headers = new Headers();
  const token = getToken();

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(getApiUrl(`/api/download/${id}`), { headers });

  if (!response.ok) {
    const message = await response.text().catch(() => "");
    throw new Error(message || `Download failed (${response.status})`);
  }

  const url = URL.createObjectURL(await response.blob());
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = fileName || `photo-${id}`;

  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();

  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
