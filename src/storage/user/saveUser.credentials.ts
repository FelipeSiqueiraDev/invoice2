import * as SecureStore from "expo-secure-store";
import { USER_CREDENTIALS } from "@storage/storageConfig";
import { SignInDTO } from "@dtos/SignInDTO";

export async function saveUserCredentials(user: SignInDTO) {
  try {
    await SecureStore.setItemAsync(USER_CREDENTIALS, JSON.stringify(user));
  } catch (err) {
    throw err;
  }
}
