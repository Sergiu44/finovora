export type AuthVerificationCode = {
  verified: boolean;
  verificationCode: {
    message: string;
    verificationCode: {
      id: number;
      expiresAt: Date;
    };
  };
};
