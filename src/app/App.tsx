import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { useThemeStore } from "@/app/themeStore";
import { AppNav } from "@/components/AppNav";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LoginScreen } from "@/features/auth/components/LoginScreen";
import { useAuthStore } from "@/features/auth/authStore";
import { bootstrapApp } from "@/app/bootstrap";
import { AppRouter } from "@/routes/AppRouter";

export const App = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const login = useAuthStore((state) => state.login);
  const mode = useThemeStore((state) => state.mode);

  useEffect(() => {
    bootstrapApp();
  }, []);

  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(mode);
  }, [mode]);

  if (!isAuthenticated) {
    return (
      <>
        <div className="fixed left-4 top-4 z-40">
          <ThemeToggle />
        </div>
        <LoginScreen onLogin={login} />
      </>
    );
  }

  return (
    <BrowserRouter>
      <div className="fixed left-4 top-4 z-40">
        <ThemeToggle />
      </div>
      <AppRouter />
      <AppNav />
    </BrowserRouter>
  );
};
