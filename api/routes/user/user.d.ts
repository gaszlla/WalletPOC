export interface User {
  id: string;
  devicePublicKey: string;
}

export interface Secret {
  share: string;
}

export interface Wallet {
  id: string;
  mainShare: string | null;
  genericSecret: string | null;
}

export interface SecretWallet {
  id: string;
  genericSecret: string;
}

export interface CreateUserRequest {
  devicePublicKey: string;
}

export interface CreateUserResponse {
  nonce: string;
  userId: string;
}

export interface VerifyUserRequest {
  userId: string;
  message: string;
  signature: string;
  devicePublicKey: string;
}
