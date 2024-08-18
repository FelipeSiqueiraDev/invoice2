import * as SecureStore from "expo-secure-store";

import { SignInDTO } from "@dtos/SignInDTO";
import { USER_CREDENTIALS } from "@storage/storageConfig";

export async function getUserCredentials() {
  try {
    const userCredentials = await SecureStore.getItemAsync(USER_CREDENTIALS);
    const userData: SignInDTO = userCredentials
      ? JSON.parse(userCredentials)
      : undefined;

    if (!userData) {
      throw userData;
    }

    return userData;
  } catch (error) {
    throw error;
  }
}
