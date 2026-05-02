import { createBrowserRouter } from "react-router";
import { DashboardLayout } from "./components/layouts/DashboardLayout";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { PatientManagement } from "./pages/PatientManagement";
import { MedicineStock } from "./pages/MedicineStock";
import { Billing } from "./pages/Billing";
import { SalesRecords } from "./pages/SalesRecords";
import { AIRecommendation } from "./pages/AIRecommendation";
import { Notifications } from "./pages/Notifications";
import { Profile } from "./pages/Profile";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "patients", element: <PatientManagement /> },
      { path: "medicines", element: <MedicineStock /> },
      { path: "billing", element: <Billing /> },
      { path: "sales", element: <SalesRecords /> },
      { path: "ai-recommendations", element: <AIRecommendation /> },
      { path: "notifications", element: <Notifications /> },
      { path: "profile", element: <Profile /> },
    ],
  },
]);
