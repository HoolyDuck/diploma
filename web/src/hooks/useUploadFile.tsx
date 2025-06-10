import { useTypedSelector } from "./store";

export const useUploadFile = () => {
  const accessToken = useTypedSelector((state) => state.auth.token);

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

  return {
    uploadFile,
  };
};
