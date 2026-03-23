import { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import { useThemeStore } from "@/app/themeStore";
import { AppNav } from "@/components/AppNav";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LoadingNotice, Page } from "@/components/ui";
import { LoginScreen } from "@/features/auth/components/LoginScreen";
import { useAuthStore } from "@/features/auth/authStore";
import { bootstrapApp } from "@/app/bootstrap";
import { AppRouter } from "@/routes/AppRouter";

export const App = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const login = useAuthStore((state) => state.login);
  const register = useAuthStore((state) => state.register);
  const mode = useThemeStore((state) => state.mode);
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setIsBootstrapping(false);
      return;
    }

    setIsBootstrapping(true);
    void bootstrapApp().finally(() => setIsBootstrapping(false));
  }, [isAuthenticated, user]);

  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(mode);
  }, [mode]);

  if (isBootstrapping) {
    return (
      <Page>
        <div className="pt-24">
          <LoadingNotice message="Cargando tu espacio y sincronizando informacion..." />
        </div>
      </Page>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <div className="fixed left-4 top-4 z-40">
          <ThemeToggle />
        </div>
        <LoginScreen onLogin={login} onRegister={register} />
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
