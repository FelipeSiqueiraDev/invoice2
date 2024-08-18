import { useRef, useEffect } from "react";
import { Center, Heading, VStack } from "@gluestack-ui/themed";

import { useNavigation } from "@react-navigation/native";
import { AuthNavigatorRoutesProps } from "@routes/auth.routes";

import LottieView from "lottie-react-native";
import LogoAnimation from "@assets/logoAnimation.json";

import { Button } from "@components/Button";

export function Initial() {
  const navigation = useNavigation<AuthNavigatorRoutesProps>();
  const animation = useRef<LottieView>(null);

  useEffect(() => {
    animation.current?.play();
  }, []);

  return (
    <VStack flex={1}>
      <Center px={"$4"} mb={"$20"} flex={1}>
        <LottieView
          ref={animation}
          autoPlay={false}
          loop={true}
          style={{
            width: 320,
            height: 320,
          }}
          source={LogoAnimation}
        />

        <Heading fontStyle={"italic"} mb={"$12"}>
          - INVOICE CHECK -
        </Heading>

        <Button
          title={"Começar"}
          onPress={() => navigation.navigate("signIn")}
        />
      </Center>
    </VStack>
  );
}
