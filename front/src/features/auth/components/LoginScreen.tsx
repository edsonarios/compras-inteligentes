import { useState } from "react";
import { Button, Field, Input, Panel } from "@/components/ui";

type AuthMode = "login" | "register";

export const LoginScreen = ({
  onLogin,
  onRegister
}: {
  onLogin: (credentials: { email: string; password: string }) => Promise<void>;
  onRegister: (payload: {
    name: string;
    email: string;
    password: string;
  }) => Promise<void>;
}) => {
  const [mode, setMode] = useState<AuthMode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim()) {
      setError("Ingresa tu correo y tu contrasena.");
      return;
    }

    if (mode === "register" && !name.trim()) {
      setError("Ingresa tu nombre para crear la cuenta.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      if (mode === "login") {
        await onLogin({
          email,
          password
        });
        return;
      }

      await onRegister({
        name,
        email,
        password
      });
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "No se pudo completar la autenticacion."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

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
            Inicia sesion con tu correo y contrasena o crea una cuenta nueva
            para entrar a tus espacios.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 rounded-[24px] border border-[var(--theme-border)] p-2">
          <Button
            variant={mode === "login" ? "primary" : "ghost"}
            className="w-full"
            onClick={() => setMode("login")}
          >
            Iniciar sesion
          </Button>
          <Button
            variant={mode === "register" ? "primary" : "ghost"}
            className="w-full"
            onClick={() => setMode("register")}
          >
            Crear cuenta
          </Button>
        </div>

        <div className="space-y-4">
          {mode === "register" ? (
            <Field label="Nombre">
              <Input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Tu nombre"
              />
            </Field>
          ) : null}

          <Field label="Correo electronico">
            <Input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="tu@email.com"
            />
          </Field>

          <Field label="Contrasena">
            <Input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Minimo 8 caracteres"
            />
          </Field>

          {error ? (
            <div className="theme-soft rounded-[20px] border border-[var(--theme-border)] px-4 py-3">
              <p className="text-sm text-red-500">{error}</p>
            </div>
          ) : null}
        </div>

        <Button className="w-full" onClick={() => void handleSubmit()} disabled={isSubmitting}>
          {isSubmitting
            ? "Procesando..."
            : mode === "login"
              ? "Entrar a mi espacio"
              : "Crear cuenta y entrar"}
        </Button>
      </Panel>
    </div>
  );
};
