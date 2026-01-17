import axios from "axios";
import type{
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  Feedback,
} from "../types";
import { getToken } from "../auth/auth";

const BASE_URL = "http://localhost:8081/api";

// ---------- LOGIN (OAuth2 FORM) ----------
export const login = async (
  email: string,
  password: string,
): Promise<LoginResponse> => {
  const formData = new URLSearchParams();
  formData.append("username", email); // OAuth2 expects username
  formData.append("password", password);

  const res = await axios.post<LoginResponse>(`${BASE_URL}/login`, formData, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

  return res.data;
};

// ---------- REGISTER ----------
export const register = async (
  data: RegisterRequest,
): Promise<RegisterResponse> => {
  const res = await axios.post<RegisterResponse>(`${BASE_URL}/register`, data);
  return res.data;
};

// ---------- USER ----------
export const createFeedback = async (message: string, rating: number) => {
  const token = getToken();
  await axios.post(
    `${BASE_URL}/feedback`,
    { message, rating },
    { headers: { Authorization: `Bearer ${token}` } },
  );
};

export const myFeedback = async (): Promise<Feedback[]> => {
  const token = getToken();
  const res = await axios.get(`${BASE_URL}/my-feedback`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// ---------- ADMIN ----------
export const allFeedback = async (): Promise<Feedback[] | null> => {
  try {
    const token = getToken();
    const res = await axios.get(`${BASE_URL}/all-feedback`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err: any) {
    if (err.response?.status === 403) {
      return null; // 👈 USER, NOT ADMIN
    }
    throw err;
  }
};



export const reviewFeedback = async (id: number) => {
  const token = getToken();
  await axios.put(
    `${BASE_URL}/feedback/${id}/review`,
    {},
    { headers: { Authorization: `Bearer ${token}` } },
  );
};
