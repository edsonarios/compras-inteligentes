import { NavLink } from "react-router-dom";
import { cn } from "@/components/ui";

const items = [
  { to: "/", label: "Resumen" },
  { to: "/compras", label: "Compras" },
  { to: "/productos", label: "Productos" },
  { to: "/ubicaciones", label: "Ubicac." }
];

export const AppNav = () => (
  <nav className="theme-elevated fixed bottom-4 left-1/2 z-20 w-[calc(100%-1.5rem)] max-w-md -translate-x-1/2 rounded-[26px] border p-2 shadow-panel backdrop-blur">
    <div className="grid grid-cols-4 gap-2">
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            cn(
              "rounded-[20px] px-3 py-3 text-center text-sm transition",
              isActive
                ? "theme-primary-button"
                : "theme-muted"
            )
          }
        >
          {item.label}
        </NavLink>
      ))}
    </div>
  </nav>
);
