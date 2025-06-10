import { SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "react-router";

export const AppsPage = () => {
  return (
    <SidebarProvider>
      <Outlet />
    </SidebarProvider>
  );
};
