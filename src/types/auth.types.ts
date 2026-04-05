export interface IRegisterResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    status: string;
    isDeleted: boolean;
    emailVerified: boolean;
  };
  session: any; // BetterAuth session
  token: string; // better-auth.session_token
  accessToken: string; // your JWT
  refreshToken: string; // your JWT
  client: {
    id: string;
    userId: string;
    fullName: string;
    email: string;
    createdAt: string;
  };
}



export interface ILOginResponse{
    token: string;
    accessToken: string;
    refreshToken: string;
    user: {
        createdAt: Date;
        updatedAt: Date;
        email: string;
        emailVerified: boolean;
        name: string;
        image?: string | null | undefined;
        role: string;
        status: string;
        needPasswordChange: boolean;
        isDeleted: boolean;
        deletedAt?: Date | null | undefined;
    }
}



