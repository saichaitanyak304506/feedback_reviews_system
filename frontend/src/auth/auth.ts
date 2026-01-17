export const setToken = (token: string) => {
  localStorage.setItem("token", token);
};

export const getToken = (): string | null => {
  return localStorage.getItem("token");
};

export const clearToken = () => {
  localStorage.removeItem("token");
};


export const getUserRole = (): "admin" | "user" => {
  const token = localStorage.getItem("token");
  if (!token) return "user";

  const payload = JSON.parse(atob(token.split(".")[1]));
  return payload.role === "admin" ? "admin" : "user";
};
