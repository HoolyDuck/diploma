import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router";
import { Provider } from "react-redux";
import { store } from "./lib/store.ts";
import { LoginPage } from "./pages/LoginPage.tsx";
import { ProtectedRoute } from "./components/protected-route.tsx";
import { AppsPage } from "./pages/apps/AppsPage.tsx";
import { AppSettingsPage } from "./pages/apps/AppSettingsPage.tsx";
import { AppsPageContent } from "./pages/apps/AppsPageContent.tsx";
import { AppsSettingsGeneral } from "./pages/apps/AppSettingsGeneral.tsx";
import { HomePage } from "./pages/home/HomePage.tsx";
import { AppDetailPage } from "./pages/app-detail/AppDetailPage.tsx";
import { AppSettingsVersions } from "./pages/apps/AppSettingsVersions.tsx";
import { RegisterPage } from "./pages/RegisterPage.tsx";
import { SearchPage } from "./pages/home/SearchPage.tsx";
import { AppPublishPage } from "./pages/apps/AppPublishPage.tsx";
import { AdminPage } from "./pages/admin/AdminPage.tsx";
import { AdminPageVersions } from "./pages/admin/AdminPageVersions.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
      {
        path: "/home",
        element: <HomePage />,
      },
      {
        path: "/search",
        element: <SearchPage />,
      },
      {
        path: "/apps/:appId",
        element: <AppDetailPage />,
      },
      {
        path: "/admin",
        element: <AdminPage />,
        children: [
          {
            path: "/admin/versions",
            element: <AdminPageVersions />,
          },
        ],
      },
      {
        path: "/dev",
        element: (
          <ProtectedRoute>
            <AppsPage />
          </ProtectedRoute>
        ),
        children: [
          {
            path: "/dev/apps",
            element: <AppsPageContent />,
          },
          {
            path: "/dev/apps/:appId",
            element: <AppSettingsPage />,
            children: [
              {
                path: "/dev/apps/:appId",
                element: <AppsSettingsGeneral />,
              },
              {
                path: "/dev/apps/:appId/versions",
                element: <AppSettingsVersions />,
              },
              {
                path: "/dev/apps/:appId/publish",
                element: <AppPublishPage />,
              },
            ],
          },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);
