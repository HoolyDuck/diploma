import { useLazyGetFileSignatureQuery } from "@/lib/api/api";
import { useTypedSelector } from "./store";

export const useUploadFile = () => {
  const accessToken = useTypedSelector((state) => state.auth.token);
  const [getAppSignature] = useLazyGetFileSignatureQuery();

  const uploadFile = async (file: File, path: string) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${import.meta.env.VITE_API_URL}/${path}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to upload file");
    }

    const data = await response.json();
    return data;
  };

  const uploadVersionFile = async (file: File, versionId: number) => {
    const { signature } = await getAppSignature(versionId).unwrap();

    if (!signature) {
      return null;
    }

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(
      `${
        import.meta.env.VITE_FILE_SERVICE_URL
      }/files/uploadVersion/${versionId}/${signature}`,
      {
        method: "POST",
        body: formData,
      }
    );

    console.log("uploadVersionFile response", response);
  };

  return {
    uploadFile,
    uploadVersionFile,
  };
};
