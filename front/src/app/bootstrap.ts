import { authService } from "@/features/auth/services/authService";
import { useAuthStore } from "@/features/auth/authStore";
import { useSpaceStore } from "@/features/spaces/spaceStore";

export const bootstrapApp = () => {
  const authState = useAuthStore.getState();
  const spaceState = useSpaceStore.getState();
  const demoUser = authService.getDemoUser();

  if (!authState.user) {
    useAuthStore.setState({ user: demoUser, isAuthenticated: false });
  }

  spaceState.initializeDefaultSpace(demoUser.id);
};
