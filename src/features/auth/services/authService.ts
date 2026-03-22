import type { User } from "@/lib/types";

const demoUser: User = {
  id: "user_demo_01",
  email: "edson@compra-inteligente.app",
  name: "Edson Demo"
};

export const authService = {
  login: async () => demoUser,
  logout: async () => undefined,
  getDemoUser: () => demoUser
};
