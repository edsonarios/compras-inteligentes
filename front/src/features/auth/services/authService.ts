import { apiRequest } from "@/lib/api";
import { mapUserFromApi } from "@/lib/mappers";
import type { User } from "@/lib/types";

type LoginPayload = {
  email: string;
  password: string;
};

type RegisterPayload = {
  name: string;
  email: string;
  password: string;
};

export const authService = {
  async login(payload: LoginPayload): Promise<User> {
    const user = await apiRequest<User>("/auth/login", {
      method: "POST",
      body: {
        email: payload.email.trim().toLowerCase(),
        password: payload.password
      }
    });

    return mapUserFromApi(user as never);
  },
  async register(payload: RegisterPayload): Promise<User> {
    const user = await apiRequest<User>("/auth/register", {
      method: "POST",
      body: {
        name: payload.name.trim(),
        email: payload.email.trim().toLowerCase(),
        password: payload.password
      }
    });

    return mapUserFromApi(user as never);
  },
  async logout() {
    return undefined;
  }
};
