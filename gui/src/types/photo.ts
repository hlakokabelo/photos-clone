export interface Photo {
  id: number;
  fileName: string;
  userId: number;
  contentType: string;
}

export interface PhotoResponse {
  id: number;
  fileName: string;
  contentType: string;
  photoUrl: string;
  downloadUrl: string;
}

export interface PhotoFilters {
  fileName: string;
  contentType: string;
  limit: number;
}
