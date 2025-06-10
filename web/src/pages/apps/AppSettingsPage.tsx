import { AppsSidebar } from "@/pages/apps/components/AppsSidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import { Outlet, useParams } from "react-router";
import { useGetApplicationByIdForDeveloperQuery } from "@/lib/api/api";

export const AppSettingsPage = () => {
  const { appId } = useParams<{ appId: string }>();

  const { data: appSettings, isLoading: isLoadingAppSettings } =
    useGetApplicationByIdForDeveloperQuery(Number(appId), {
      skip: !appId,
      refetchOnFocus: true,
    });

  return (
    <>
      <AppsSidebar />
      <SidebarInset>
        <Outlet />
      </SidebarInset>
    </>
  );
};
