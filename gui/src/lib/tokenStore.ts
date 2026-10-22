let token: string | null = null;

export const getToken = () => token;

export const setToken = (value: string | null) => {
  token = value?.trim() || null;
};

export const clearToken = () => {
  token = null;
};
