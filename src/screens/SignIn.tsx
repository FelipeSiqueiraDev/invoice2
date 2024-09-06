import { useState } from "react";
import { Keyboard } from "react-native";
import {
  ScrollView,
  VStack,
  Heading,
  Icon,
  onChange,
} from "@gluestack-ui/themed";

import axios from "axios";
import { SignInDTO } from "@dtos/SignInDTO";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";

import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "@hooks/useAuth";

const signInSchema = yup.object({
  username: yup.string().required("Usuário obrigatório"),
  password: yup.string().required("Senha obrigatória"),
});

export function SingIn() {
  const [passwordVisibility, setPasswordVisibility] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const navigation = useNavigation();
  const { signIn } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInDTO>({
    resolver: yupResolver(signInSchema),
  });

  async function handleSignIn({ username, password }: SignInDTO) {
    Keyboard.dismiss();
    setIsLoading(true);

    try {
      await signIn({ username, password });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <VStack
        flex={1}
        alignItems={"center"}
        justifyContent={"center"}
        px={"$8"}
        pb={"$16"}
      >
        <Heading color={"$gray700"} mb={"$6"}>
          Acesse sua conta
        </Heading>

        <Controller
          name={"username"}
          control={control}
          render={({ field: { onChange, value } }) => (
            <Input
              placeholder={"Usuário"}
              keyboardType={"default"}
              autoCapitalize={"none"}
              onChangeText={onChange}
              value={value}
              errorMessage={errors.username?.message}
            />
          )}
        />

        <Controller
          name={"password"}
          control={control}
          render={({ field: { onChange, value } }) => (
            <Input
              placeholder={"Senha"}
              secureTextEntry={passwordVisibility}
              onChangeText={onChange}
              value={value}
              autoCorrect={false}
              autoCapitalize={"none"}
              errorMessage={errors.password?.message}
            />
          )}
        />

        <Button
          title={"Acessar"}
          onPress={handleSubmit(handleSignIn)}
          isLoading={isLoading}
          mt={"$8"}
        />
      </VStack>
    </ScrollView>
  );
}
