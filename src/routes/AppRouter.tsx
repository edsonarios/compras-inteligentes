import { Route, Routes } from "react-router-dom";
import { DashboardPage } from "@/routes/DashboardPage";
import { LocationsPage } from "@/routes/LocationsPage";
import { ProductsPage } from "@/routes/ProductsPage";
import { PurchasesPage } from "@/routes/PurchasesPage";

export const AppRouter = () => (
  <Routes>
    <Route path="/" element={<DashboardPage />} />
    <Route path="/productos" element={<ProductsPage />} />
    <Route path="/compras" element={<PurchasesPage />} />
    <Route path="/ubicaciones" element={<LocationsPage />} />
  </Routes>
);
