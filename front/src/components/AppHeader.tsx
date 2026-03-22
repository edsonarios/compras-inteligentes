import { SpaceSwitcher } from "@/features/spaces/components/SpaceSwitcher";

export const AppHeader = ({
  eyebrow,
  title,
  description
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) => (
  <header className="mb-6">
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="theme-muted text-xs uppercase tracking-[0.3em]">
          {eyebrow}
        </p>
        <h1 className="theme-text mt-3 text-3xl font-semibold">{title}</h1>
        {description ? (
          <p className="theme-muted mt-2 max-w-sm text-sm leading-6">
            {description}
          </p>
        ) : null}
      </div>
      <SpaceSwitcher />
    </div>
  </header>
);
