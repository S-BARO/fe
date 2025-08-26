declare global {
  interface Window {
    Kakao: {
      init: (appKey: string) => void;
      isInitialized: () => boolean;
      Auth: {
        login: (options: {
          success: (authObj: KakaoAuthResponse) => void;
          fail: (err: unknown) => void;
        }) => void;
        logout: (callback: () => void) => void;
        getAccessToken: () => string | null;
        setAccessToken: (token: string) => void;
      };
      API: {
        request: (options: {
          url: string;
          success: (res: unknown) => void;
          fail: (err: unknown) => void;
        }) => void;
      };
    };
  }
}

export interface KakaoAuthResponse {
  access_token: string;
  token_type: string;
  refresh_token: string;
  expires_in: number;
  scope: string;
  refresh_token_expires_in: number;
}

export interface KakaoUser {
  id: number;
  connected_at: string;
  properties: {
    nickname: string;
    profile_image?: string;
    thumbnail_image?: string;
  };
  kakao_account: {
    profile: {
      nickname: string;
      thumbnail_image_url?: string;
      profile_image_url?: string;
    };
    email?: string;
    age_range?: string;
    birthday?: string;
    gender?: string;
  };
}
