import type {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  PropsWithChildren,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes
} from "react";

export const cn = (...values: Array<string | false | null | undefined>) =>
  values.filter(Boolean).join(" ");

export const Page = ({ children }: PropsWithChildren) => (
  <div className="theme-text mx-auto min-h-screen w-full max-w-md bg-grid bg-[size:24px_24px] px-4 pb-28 pt-6">
    {children}
  </div>
);

export const Panel = ({
  children,
  className
}: PropsWithChildren<{ className?: string }>) => (
  <section
    className={cn(
      "theme-panel rounded-[28px] border p-4 shadow-panel backdrop-blur",
      className
    )}
  >
    {children}
  </section>
);

export const Button = ({
  children,
  className,
  variant = "primary",
  type = "button",
  isLoading = false,
  disabled,
  ...props
}: PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "secondary" | "ghost";
    isLoading?: boolean;
  }
>) => (
  <button
    type={type}
    className={cn(
      "inline-flex min-h-11 items-center justify-center rounded-2xl px-4 text-sm font-medium transition hover:opacity-90",
      variant === "primary" && "theme-primary-button",
      variant === "secondary" && "theme-secondary-button",
      variant === "ghost" && "theme-muted bg-transparent",
      className
    )}
    {...props}
    disabled={disabled || isLoading}
  >
    {isLoading ? (
      <>
        <Spinner className="mr-2 h-4 w-4" />
        <span>{children}</span>
      </>
    ) : (
      children
    )}
  </button>
);

export const Spinner = ({ className }: { className?: string }) => (
  <span
    className={cn(
      "inline-block h-5 w-5 animate-spin rounded-full border-2 border-current border-r-transparent",
      className
    )}
    aria-hidden="true"
  />
);

export const LoadingNotice = ({
  message = "Cargando informacion..."
}: {
  message?: string;
}) => (
  <Panel className="flex items-center gap-3">
    <Spinner />
    <p className="theme-muted text-sm">{message}</p>
  </Panel>
);

export const Field = ({
  label,
  hint,
  children
}: PropsWithChildren<{ label: string; hint?: ReactNode }>) => (
  <label className="theme-muted flex flex-col gap-2 text-sm">
    <span className="flex items-center justify-between">
      <span>{label}</span>
      {hint}
    </span>
    {children}
  </label>
);

export const Input = (props: InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    className={cn(
      "theme-input min-h-11 rounded-2xl border px-3 text-sm outline-none focus:opacity-100",
      props.className
    )}
  />
);

export const Select = (props: SelectHTMLAttributes<HTMLSelectElement>) => (
  <select
    {...props}
    className={cn(
      "theme-input min-h-11 rounded-2xl border px-3 text-sm outline-none focus:opacity-100",
      props.className
    )}
  />
);

export const Textarea = (props: TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea
    {...props}
    className={cn(
      "theme-input min-h-24 rounded-2xl border px-3 py-3 text-sm outline-none focus:opacity-100",
      props.className
    )}
  />
);

export const SectionHeader = ({
  title,
  subtitle,
  action
}: {
  title: ReactNode;
  subtitle?: string;
  action?: ReactNode;
}) => (
  <div className="mb-4 flex items-start justify-between gap-3">
    <div>
      <h2 className="theme-text text-lg font-semibold">
        {title}
      </h2>
      {subtitle ? (
        <p className="theme-muted mt-1 text-sm">{subtitle}</p>
      ) : null}
    </div>
    {action}
  </div>
);
