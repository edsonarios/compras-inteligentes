import { Button } from "@/components/ui";
import { useThemeStore } from "@/app/themeStore";

export const ThemeToggle = () => {
  const mode = useThemeStore((state) => state.mode);
  const toggleMode = useThemeStore((state) => state.toggleMode);

  return (
    <Button
      variant="secondary"
      className="h-11 w-11 rounded-full border border-[var(--theme-border)] px-0 text-lg"
      onClick={toggleMode}
      aria-label={mode === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      title={mode === "dark" ? "Modo claro" : "Modo oscuro"}
    >
      <span aria-hidden="true">{mode === "dark" ? "☀" : "☾"}</span>
    </Button>
  );
};
