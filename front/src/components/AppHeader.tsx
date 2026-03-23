import { useState } from "react";
import { Button } from "@/components/ui";
import { useAuthStore } from "@/features/auth/authStore";
import { useLocationStore } from "@/features/locations/locationStore";
import { useProductStore } from "@/features/products/productStore";
import { usePurchaseStore } from "@/features/purchases/purchaseStore";
import { SpaceSwitcher } from "@/features/spaces/components/SpaceSwitcher";
import { useSpaceStore } from "@/features/spaces/spaceStore";

export const AppHeader = ({
  eyebrow,
  title,
  description
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const resetSpaces = useSpaceStore((state) => state.resetSpaces);
  const resetProducts = useProductStore((state) => state.resetProducts);
  const resetLocations = useLocationStore((state) => state.resetLocations);
  const resetPurchases = usePurchaseStore((state) => state.resetPurchases);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <header className="mb-6">
      <div className="mb-4 flex items-start justify-between gap-4">
        <SpaceSwitcher />

        <div className="relative">
          <Button
            variant="secondary"
            className="min-h-11 rounded-full border border-[var(--theme-border)] px-3"
            onClick={() => setIsUserMenuOpen((value) => !value)}
          >
            <span className="sr-only">Abrir menu de usuario</span>
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path d="M20 21a8 8 0 0 0-16 0" />
              <circle cx="12" cy="8" r="4" />
            </svg>
          </Button>

          {isUserMenuOpen ? (
            <div className="theme-elevated absolute right-0 top-14 z-30 w-56 rounded-[24px] border p-3 shadow-panel backdrop-blur">
              <div className="border-b border-[var(--theme-border)] pb-3">
                <p className="theme-muted text-xs uppercase tracking-[0.24em]">
                  Usuario actual
                </p>
                <p className="theme-text mt-2 text-sm font-medium">
                  {user?.name ?? "Sin usuario"}
                </p>
                {user?.email ? (
                  <p className="theme-muted mt-1 text-xs">{user.email}</p>
                ) : null}
              </div>

              <div className="pt-3">
                <button
                  type="button"
                  className="theme-text w-full rounded-2xl px-3 py-3 text-left text-sm transition hover:opacity-80"
                  onClick={async () => {
                    setIsUserMenuOpen(false);
                    await logout();
                    resetSpaces();
                    resetProducts();
                    resetLocations();
                    resetPurchases();
                  }}
                >
                  Cerrar sesion
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>

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
    </header>
  );
};
