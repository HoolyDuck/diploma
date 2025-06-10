import { Separator } from "@/components/ui/separator";
import { AppSettingsIcon } from "./components/AppsSettingsIcon";
import { AppSettingsTextForm } from "./components/AppsSettingsTextForm";
import { useParams } from "react-router";
import { useGetApplicationByIdForDeveloperQuery } from "@/lib/api/api";
import { mockAppDetail } from "@/lib/mocks";
import { AppSettingsImages } from "./components/AppSettingsImages";

const appSettings = mockAppDetail;

export const AppsSettingsGeneral = () => {
  const { appId } = useParams<{ appId: string }>();

  // const { data: appSettings, isLoading: isLoadingAppSettings } =
  //   useGetApplicationByIdForDeveloperQuery(Number(appId), {
  //     skip: !appId,
  //     refetchOnFocus: true,
  //   });

  console.log("appSettings", appSettings);

  // if (isLoadingAppSettings) {
  //   return <div>Loading...</div>;
  // }

  return (
    <div className="flex flex-col gap-4 p-6">
      <AppSettingsIcon mediaUrl={appSettings?.iconMedia?.mediaUrl} />
      <Separator />
      <AppSettingsTextForm
        title={appSettings?.title || ""}
        description={appSettings?.description}
      />
      <Separator />
      <AppSettingsImages />
    </div>
  );
};
