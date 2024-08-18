import { useState } from "react";
import { Center, Icon, Text } from "@gluestack-ui/themed";

import { useAuth } from "@hooks/useAuth";
import { useNavigation } from "@react-navigation/native";
import { ProgramNavigatorRoutesProps } from "@routes/program.routes";

import Dialog from "react-native-dialog";

import { Feather } from "@expo/vector-icons";
import { Button } from "@components/Button";

export function Home() {
  const [logoutModalVisibility, setLogoutModalVisibility] = useState(false);

  const { signOut, user } = useAuth();
  const navigation = useNavigation<ProgramNavigatorRoutesProps>();

  return (
    <Center flex={1} px={"$8"}>
      <Icon
        //@ts-ignore
        name={"log-out"}
        as={Feather}
        color={"$blue700"}
        position={"absolute"}
        top={"$16"}
        right={"$8"}
        size={"lg"}
        onPress={() => setLogoutModalVisibility(true)}
      />
      <Text color={"$blue900"} position={"absolute"} top={"$16"} left={"$8"}>
        2.0.0
      </Text>

      <Button
        title="Começar Viagem"
        onPress={() => navigation.navigate("checkout")}
      />

      <Dialog.Container visible={logoutModalVisibility}>
        <Dialog.Title>Logout</Dialog.Title>
        <Dialog.Description>Deseja realmente sair?</Dialog.Description>
        <Dialog.Button label={"Sair"} onPress={signOut} />
        <Dialog.Button
          label={"Cancelar"}
          onPress={() => {
            setLogoutModalVisibility(false);
          }}
        />
      </Dialog.Container>
    </Center>
  );
}
