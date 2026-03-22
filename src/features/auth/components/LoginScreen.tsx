import { Button, Panel } from "@/components/ui";
import { authService } from "@/features/auth/services/authService";

export const LoginScreen = ({ onLogin }: { onLogin: () => Promise<void> }) => {
  const user = authService.getDemoUser();

  return (
    <div className="mx-auto flex min-h-screen max-w-md items-center px-4">
      <Panel className="w-full space-y-6 p-6">
        <div className="space-y-3">
          <p className="theme-muted text-xs uppercase tracking-[0.3em]">
            Compra Inteligente
          </p>
          <h1 className="theme-text text-3xl font-semibold">
            Registra, compara y decide mejor.
          </h1>
          <p className="theme-muted text-sm leading-6">
            Inicio simulado para la fase frontend. El usuario base ya viene
            definido y luego podremos conectarlo a NestJS.
          </p>
        </div>

        <div className="theme-soft rounded-[24px] border border-[var(--theme-border)] p-4">
          <p className="theme-muted text-sm">Usuario demo</p>
          <p className="theme-text mt-2 text-base font-medium">
            {user.name}
          </p>
          <p className="theme-muted text-sm">{user.email}</p>
        </div>

        <Button className="w-full" onClick={onLogin}>
          Entrar a mi espacio
        </Button>
      </Panel>
    </div>
  );
};
