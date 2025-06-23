import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ImageGallery from "react-image-gallery";

import "react-image-gallery/styles/css/image-gallery.css";
import "./styles/ImageGallery.css";

import { Header } from "@/components/header";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import {
  useCreateAppDownloadMutation,
  useCreateReviewMutation,
  useGetApplicationByIdQuery,
  useGetApplicationsQuery,
  useGetAppReviewsQuery,
  useLazyGetFileSignatureQuery,
} from "@/lib/api/api";
import {
  AlertTriangleIcon,
  ArrowLeft,
  ArrowRight,
  DownloadIcon,
  Fullscreen,
  Star,
} from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router";
import { toast } from "sonner";

export const AppDetailPage = () => {
  const { appId } = useParams<{ appId: string }>();
  const [getFileSignature] = useLazyGetFileSignatureQuery();

  const { data: app, isLoading: isLoadingApp } = useGetApplicationByIdQuery(
    Number(appId),
    {
      skip: !appId,
      refetchOnFocus: true,
    }
  );

  const { data: reviews } = useGetAppReviewsQuery(Number(appId), {
    skip: !appId,
    refetchOnFocus: true,
  });

  const [createReviewMutation] = useCreateReviewMutation();

  const [appRating, setAppRating] = useState<number | null>(5);

  const { data: recommendedApps } = useGetApplicationsQuery({
    take: 4,
  });

  const filteredRecommendedApps = recommendedApps?.filter(
    (recommendedApp) => recommendedApp.id !== app?.id
  );

  const [createAppDownloadMutation] = useCreateAppDownloadMutation();

  const downloadApp = async () => {
    const fileId = app?.activeVersion?.fileId;

    const { signature } = await getFileSignature(fileId).unwrap();

    window.open(
      `${
        import.meta.env.VITE_FILE_SERVICE_URL
      }/files/download/${fileId}/${signature}`,
      "_blank"
    );

    if (appId) {
      try {
        await createAppDownloadMutation({
          applicationId: Number(appId),
        }).unwrap();
      } catch {
        toast.error("Сталася помилка при завантаженні застосунку.");
      }
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!appId || !appRating) return;

    const formData = new FormData(e.currentTarget);
    const comment = formData.get("comment") as string;

    try {
      await createReviewMutation({
        appId: Number(appId),
        rating: appRating,
        comment: comment,
      }).unwrap();
      toast.success("Відгук успішно надіслано!");
    } catch {
      toast.error("Сталася помилка при надсиланні відгуку.");
    }
  };

  if (isLoadingApp) {
    return (
      <div className="flex justify-center items-center h-screen">
        Завантаження...
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="flex flex-col items-center min-h-svh w-full p-6 gap-6">
        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="col-span-1 md:col-span-3">
            <div>
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-4">
                  <img
                    src={app.iconMedia?.mediaUrl || app.icon}
                    alt={app.title}
                    className="w-16 h-16 object-cover rounded"
                    height="32"
                    width="32"
                  />
                  <div className="flex flex-col">
                    <h1 className="text-2xl font-bold">{app.title}</h1>
                    <div className="flex">
                      <div className="flex items-center gap-2 border-r pr-2 mr-2">
                        <DownloadIcon className="!size-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          {app.downloads} завантажень
                        </span>
                      </div>
                      <div className="flex items-center gap-2 ">
                        <Star className="!size-4 text-yellow-500" />
                        <span className="text-sm text-gray-600">
                          {app.averageRating} / 5
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <Button
                  className="ml-auto"
                  onClick={downloadApp}
                >
                  <span>Завантажити</span>
                </Button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {app.AppCategory?.map((category, index) => (
                <Badge key={index}>{category.category.categoryName}</Badge>
              ))}
            </div>

            <div>
              <p className="text-sm text-gray-600">{app.description}</p>
            </div>
            <div className="max-w-4xl mt-6 overflow-hidden max-h-[500px] relative border rounded-lg shadow-sm">
              <ImageGallery
                showBullets={true}
                showThumbnails={false}
                showPlayButton={false}
                items={app.AppMedia!.map(({ media }) => ({
                  original: media.mediaUrl,
                  thumbnail: media.mediaUrl,
                }))}
                renderFullscreenButton={(onClick, isFullscreen) => (
                  <Button
                    variant="ghost"
                    onClick={onClick}
                    className="absolute bottom-2 right-2 z-10"
                  >
                    <Fullscreen
                      className="!size-6"
                      color={isFullscreen ? "white" : "currentColor"}
                    />
                  </Button>
                )}
                renderLeftNav={(onClick, disabled) => (
                  <Button
                    variant="ghost"
                    onClick={onClick}
                    disabled={disabled}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10"
                  >
                    <ArrowLeft className="!size-6" />
                  </Button>
                )}
                renderRightNav={(onClick, disabled) => (
                  <Button
                    variant="ghost"
                    onClick={onClick}
                    disabled={disabled}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10"
                  >
                    <ArrowRight className="!size-6" />
                  </Button>
                )}
              />
            </div>
            <div>
              <h2 className="text-lg font-semibold mt-6 mb-2">
                Залиште відгук
              </h2>

              <form onSubmit={handleReviewSubmit}>
                <div>
                  <label className="block  text-sm font-medium text-gray-700 mb-2">
                    Оцінка
                  </label>

                  <div className="flex items-center gap-2 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        fill={
                          appRating && appRating >= star
                            ? "currentColor"
                            : "none"
                        }
                        key={star}
                        className="!size-6 cursor-pointer text-yellow-500"
                        onClick={() => setAppRating(star)}
                      />
                    ))}
                  </div>
                </div>
                <Textarea
                  placeholder="Ваші враження від застосунку..."
                  className="mb-4"
                  rows={4}
                  name="comment"
                />
                <div className="flex items-center justify-between">
                  <Button>Опублікувати</Button>
                  <div className="flex items-center gap-2 text-red-500">
                    <AlertTriangleIcon className="!size-4 text-red-500 " />
                    <span className="text-sm">Поскаржитися на застосунок</span>
                  </div>
                </div>
              </form>
            </div>
            <div className="flex flex-col gap-4 mt-6">
              {reviews?.length > 0 ? (
                reviews!.map((review) => (
                  <div
                    key={review.id}
                    className="border rounded-lg p-4 shadow-sm"
                  >
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <Avatar>
                          <AvatarImage
                            src={`https://ui-avatars.com/api/?name=${review.user.username}&background=random`}
                          />
                        </Avatar>
                        <span className="font-semibold">
                          {review.user.username}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <Star className="!size-4 mt-1 text-yellow-500" />
                          <span>{review.rating}/5</span>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500">
                            {new Date(review.createdAt).toDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{review.comment}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No reviews yet.</p>
              )}
            </div>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-4">
              Також можуть сподобатися
            </h2>
            <div className="flex flex-col gap-4">
              {filteredRecommendedApps?.map((appMock, index) => (
                <div
                  key={index}
                  className="flex border rounded-lg p-4 shadow-sm gap-4 align-center"
                >
                  <img
                    src={appMock.iconMedia?.mediaUrl}
                    alt={appMock.title}
                    className="w-16 h-16 object-cover rounded"
                    height="32"
                    width="32"
                  />
                  <div className="flex flex-col">
                    <h2 className="text-md font-semibold">{appMock.title}</h2>
                    <p className="text-sm text-gray-600 max-h-[4rem] text-ellipsis overflow-hidden">
                      {appMock.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
