import { credentialApi } from "./axios";
import type { FittingSourceImagesResponse, UploadUrlResponse, AiFittingRequest } from "./types";

/**
 * 사용자 피팅 소스 이미지 목록 조회
 * 현재 로그인한 사용자가 업로드 완료한 피팅 소스 이미지 목록을 조회합니다.
 */
export const getFittingSourceImages = async (): Promise<FittingSourceImagesResponse> => {
  const response = await credentialApi.get<FittingSourceImagesResponse>("/fit/source-images");
  return response.data;
};

/**
 * 피팅 소스 이미지 업로드 URL 생성
 * 사용자가 피팅 소스 이미지를 S3에 직접 업로드할 수 있는 presigned URL을 생성합니다.
 */
export const createUploadUrl = async (): Promise<UploadUrlResponse> => {
  const response = await credentialApi.post<UploadUrlResponse>("/fit/source-images/upload-url");
  return response.data;
};

/**
 * 피팅 소스 이미지 업로드 완료
 * S3에 업로드된 피팅 소스 이미지를 데이터베이스에 저장하고 상태를 COMPLETED로 변경합니다.
 */
export const completeImageUpload = async (imageId: number): Promise<void> => {
  await credentialApi.put(`/fit/source-images/${imageId}`);
};

/**
 * AI 피팅 이미지 생성
 * 사용자가 업로드한 피팅 소스 이미지와 의류 이미지를 사용하여 AI 피팅 이미지를 생성합니다.
 */
export const createAiFitting = async (request: AiFittingRequest): Promise<Blob> => {
  const response = await credentialApi.post("/fit/ai-fitting", request, {
    responseType: 'blob',
    headers: {
      'Accept': 'image/png',
    },
  });
  return response.data;
};
