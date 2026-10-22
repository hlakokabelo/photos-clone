import { getToken } from "../lib/tokenStore";
import { getApiUrl } from "./apiClient";

export async function downloadPhoto(
  id: number,
  fileName?: string,
  setResponse?: (response: any) => void,
): Promise<void> {
  const headers = new Headers();
  const token = getToken();

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response: Response = await fetch(getApiUrl(`/api/download/${id}`), {
    headers,
  });

  console.log(response);
  if (setResponse) setResponse(response);

  if (!response.ok) {
    const message = await response.text().catch(() => "");
    throw new Error(message || `Download failed (${response.status})`);
  }

  // Prefer the original filename supplied by the API.
  const disposition = response.headers.get("Content-Disposition");

  let originalName: string | undefined;

  if (disposition) {
    // Supports filename="photo.jpg" and filename*=UTF-8''photo%20name.jpg
    const encodedMatch = disposition.match(
      /filename\*\s*=\s*(?:UTF-8'')?([^;]+)/i,
    );
    const regularMatch = disposition.match(
      /filename\s*=\s*"([^"]+)"|filename\s*=\s*([^;]+)/i,
    );

    if (encodedMatch) {
      try {
        originalName = decodeURIComponent(
          encodedMatch[1].trim().replace(/^"|"$/g, ""),
        );
      } catch {
        originalName = undefined;
      }
    }

    if (!originalName && regularMatch) {
      originalName = (regularMatch[1] ?? regularMatch[2])
        .trim()
        .replace(/^"|"$/g, "");
    }
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;

  anchor.download = originalName || fileName || `photo-${id}`;

  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();

  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
