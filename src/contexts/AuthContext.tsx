import { createContext, useState, useEffect } from "react";

import { SignInDTO } from "@dtos/SignInDTO";
import { UserDTO } from "@dtos/UserDTO";

import { api } from "@services/api";

import axios from "axios";

import Toast from "react-native-toast-message";

import { deleteUserCredentials } from "@storage/user/deleteUser.credentials";
import { getUserCredentials } from "@storage/user/getUser.credentials";
import { saveUserCredentials } from "@storage/user/saveUser.credentials";

export type AuthContextDataProps = {
  user: UserDTO | undefined;
  signIn: (credentials: SignInDTO) => Promise<void>;
  logged: boolean;
  signOut: () => void;
};

type AuthContextProviderProps = {
  children: React.ReactNode;
};

export const AuthContext = createContext<AuthContextDataProps>(
  {} as AuthContextDataProps
);

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [user, setUser] = useState<UserDTO>();
  const [logged, setLogged] = useState(false);

  async function signIn({ username, password }: SignInDTO) {
    try {
      const {
        data: { Entity },
      } = await api.post("Account/LoginOnApp", { username, password });

      await saveUserCredentials({ username, password });
      setUser(Entity);
      setLogged(true);

      Toast.show({
        type: "success",
        text1: "Login efetuado com sucesso",
        text2: `Seja bem vindo ${Entity.DisplayName}`,
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data);

        Toast.show({
          type: "error",
          text1: "Erro ao fazer login",
          text2: error.response?.data,
        });
      } else {
        console.log(error);

        Toast.show({
          type: "error",
          text1: "Erro ao fazer login",
          text2: "Ocorreu um erro desconhecido, tente novamente",
        });
      }
    }
  }

  async function signOut() {
    await deleteUserCredentials();
    setUser(undefined);
    setLogged(false);
  }

  async function keepLoggedIn() {
    try {
      const { username, password } = await getUserCredentials();

      if ({ username, password }) {
        await signIn({ username, password });
      }
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    keepLoggedIn();
  }, []);

  return (
    <AuthContext.Provider value={{ user, signIn, logged, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
