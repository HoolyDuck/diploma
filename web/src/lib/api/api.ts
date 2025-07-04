import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store";
import { clearCredentials, setToken, setUser } from "../slices/auth.slice"; // Import setCredentials

import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import type { LoginRequest } from "@/types/login/login.request";
import type { LoginResponse } from "@/types/login/login.response";
import type { User } from "@/types/user.type";
import type { Application } from "@/types/application/application.type";
import type { SearchApplicationDto } from "@/types/application/search-application.dto.type";

interface RefreshResponse {
  accessToken: string;
}

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
  credentials: "include",
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  console.log("baseQuery result", result.error);
  if (result.error && result.error.status === 401) {
    const refreshResult = await baseQuery(
      { url: "/auth/refresh" },
      api,
      extraOptions
    );
    console.log("refreshResult", refreshResult);

    if (refreshResult.data) {
      const { accessToken } = refreshResult.data as RefreshResponse;
      api.dispatch(setToken({ token: accessToken }));

      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(clearCredentials());
    }
  }
  return result;
};

export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "User",
    "Applications",
    "PopularApplications",
    "DeveloperApplications",
    "DeveloperApplicationById",
    "Versions",
    "Categories",
    "Reviews",
  ],
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
    register: builder.mutation({
      query: (credentials) => ({
        url: "/auth/register",
        method: "POST",
        body: credentials,
      }),
    }),

    getMe: builder.query<User, undefined>({
      query: () => ({
        url: "/auth/me",
        method: "GET",
      }),
      providesTags: ["User"],
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser({ user: data }));
        } catch (error) {
          console.error("Failed to fetch user", error);
        }
      },
    }),
    getCategories: builder.query({
      query: () => ({
        url: "/categories/findAll",
        method: "GET",
      }),
      providesTags: ["Categories"],
    }),
    getApplications: builder.query<Application[], SearchApplicationDto>({
      query: (params) => ({
        url: "/application/findMany",
        method: "GET",
        params: {
          take: params.take || 10,
          search: params.search,
          categoryId: params.categoryId,
          sortBy: "createdAt",
        },
      }),
      providesTags: ["Applications"],
    }),
    getPopularApplications: builder.query<
      Application[],
      { take?: number; skip?: number }
    >({
      query: ({ take = 10, skip = 0 }) => ({
        url: "/application/findPopular",
        method: "GET",
        params: { take, skip },
      }),
      providesTags: ["PopularApplications"],
    }),
    getDeveloperApplications: builder.query({
      query: () => ({
        url: `/application/findForDeveloper`,
        method: "GET",
      }),
      providesTags: ["DeveloperApplications"],
    }),
    getApplicationById: builder.query({
      query: (id: number) => ({
        url: `/application/findById/${id}`,
        method: "GET",
      }),
      providesTags: ["DeveloperApplicationById"],
    }),
    createApplication: builder.mutation({
      query: (data) => ({
        url: "/application",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Applications"],
    }),
    updateApplication: builder.mutation({
      query: ({ id, updateApplicationDto }) => ({
        url: `/application/update/${id}`,
        method: "PATCH",
        body: updateApplicationDto,
      }),
      invalidatesTags: ["DeveloperApplicationById", "Applications"],
    }),
    updateApplicationInfo: builder.mutation({
      query: ({ id, updateApplicationDto }) => ({
        url: `/application/updateInfo/${id}`,
        method: "PATCH",
        body: updateApplicationDto,
      }),
      invalidatesTags: ["DeveloperApplicationById", "Applications"],
    }),
    getAppVersions: builder.query({
      query: (appId: number) => ({
        url: `/version/findByAppId/${appId}`,
        method: "GET",
      }),
      providesTags: ["Versions"],
    }),
    createVersion: builder.mutation({
      query: ({ appId, versionName }) => ({
        url: `/version/create/${appId}`,
        method: "POST",
        body: { versionName },
      }),
      invalidatesTags: ["Versions"],
    }),
    sendVersionForReview: builder.mutation({
      query: (versionId: number) => ({
        url: `/version/sendForReview/${versionId}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Versions"],
    }),
    setActiveVersion: builder.mutation({
      query: ({ versionId, appId }) => ({
        url: `/version/setAsActive/${versionId}`,
        method: "PATCH",
        body: { appId },
      }),
      invalidatesTags: ["DeveloperApplicationById", "Applications"],
    }),
    getAppReviews: builder.query({
      query: (appId: number) => ({
        url: `/application/reviews/${appId}`,
        method: "GET",
      }),
      providesTags: ["Reviews"],
    }),
    createReview: builder.mutation({
      query: ({ appId, rating, comment }) => ({
        url: `/application/createReview/${appId}`,
        method: "POST",
        body: { rating, comment },
      }),
      invalidatesTags: ["Reviews", "DeveloperApplicationById"],
    }),
    getFileSignature: builder.query({
      query: () => ({
        url: "/files/generateFileSignature",
        method: "GET",
      }),
    }),
    createAppDownload: builder.mutation({
      query: ({ applicationId }) => ({
        url: `/application/createAppDownload/${applicationId}`,
        method: "PATCH",
      }),
      invalidatesTags: ["DeveloperApplicationById", "Applications"],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetMeQuery,
  useGetCategoriesQuery,
  useGetApplicationsQuery,
  useCreateApplicationMutation,
  useUpdateApplicationMutation,
  useUpdateApplicationInfoMutation,
  useGetDeveloperApplicationsQuery,
  useGetApplicationByIdQuery,
  useGetAppVersionsQuery,
  useCreateVersionMutation,
  useSendVersionForReviewMutation,
  useSetActiveVersionMutation,
  useGetAppReviewsQuery,
  useCreateReviewMutation,
  useLazyGetFileSignatureQuery,
  useGetPopularApplicationsQuery,
  useCreateAppDownloadMutation,
} = api;
