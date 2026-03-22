export const storageKeys = {
  auth: "compra-inteligente-auth",
  spaces: "compra-inteligente-spaces",
  locations: "compra-inteligente-locations",
  products: "compra-inteligente-products",
  purchases: "compra-inteligente-purchases"
} as const;

export const storage = {
  read<T>(key: string, fallback: T): T {
    if (typeof window === "undefined") {
      return fallback;
    }

    try {
      const raw = window.localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
      return fallback;
    }
  },
  write<T>(key: string, value: T) {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(key, JSON.stringify(value));
  }
};
