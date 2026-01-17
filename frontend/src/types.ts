// ---------- AUTH ----------
export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  message: string;
}

// ---------- FEEDBACK ----------
export interface Feedback {
  id: number;
  message: string;
  rating: number;
  status: string;
}
