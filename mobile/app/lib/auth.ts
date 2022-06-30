import * as LocalAuthentication from "expo-local-authentication";
import { generateKeyPair, sign } from "react-native-secure-encryption-module";
import constants from "../config/constants";

export const createDeviceKey = async (): Promise<string> => {
  const { success } = await LocalAuthentication.authenticateAsync({
    promptMessage: "Authenticate in WalletPOC",
    cancelLabel: "cancel",
  });

  if (!success) {
    // Show snackbar here or similar
    throw new Error("Authentication not successful");
  }

  return await generateKeyPair(constants.deviceKeyName);
};

export const signWithDeviceKey = async (message: string): Promise<string> => {
  const { success } = await LocalAuthentication.authenticateAsync({
    promptMessage: "Authenticate to verify your Device WalletPOC",
    cancelLabel: "cancel",
  });

  if (!success) {
    // Show snackbar here or similar
    throw new Error("Authentication not successful");
  }

  return await sign(message, constants.deviceKeyName);
};
