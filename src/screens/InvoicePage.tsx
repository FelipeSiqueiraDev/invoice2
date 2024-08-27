import { useEffect, useState } from "react";
import { Linking, Modal } from "react-native";
import {
  Center,
  Heading,
  HStack,
  Icon,
  Image,
  Pressable,
  Text,
  View,
  VStack,
  Button as NBButton,
} from "@gluestack-ui/themed";

import Dialog from "react-native-dialog";

import { useNavigation, RouteProp, useRoute } from "@react-navigation/native";
import { ProgramNavigatorRoutesProps } from "@routes/program.routes";
import { Feather } from "@expo/vector-icons";

import { InvoiceDTO } from "@dtos/InvoiceDTO";
import { useDocument } from "@hooks/useDocuments";

import Toast from "react-native-toast-message";

import { AntDesign } from "@expo/vector-icons";
import { useCameraPermissions } from "expo-camera";
import { launchCameraAsync } from "expo-image-picker";
import { Button } from "@components/Button";

export type ProgramRoutesParams = {
  invoicePage: {
    data: InvoiceDTO;
  };
};

type InvoicePageRouteProp = RouteProp<ProgramRoutesParams, "invoicePage">;

export function InvoicePage() {
  const navigation = useNavigation<ProgramNavigatorRoutesProps>();
  const {
    documents,
    addImageToDocument,
    removeDocument,
    removeImageFromDocument,
  } = useDocument();

  const route = useRoute<InvoicePageRouteProp>();
  const { data } = route.params;

  console.log(data)

  const [permission, requestPermission] = useCameraPermissions();
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [addDeleteDoclVisibility, setAddDeleteDoclVisibility] = useState(false);

  async function handleCameraSettings() {
    if (permission?.status === "denied") {
      Toast.show({
        type: "error",
        text1: "Permissão da câmera necessária",
        text2: "Dê permissão à câmera para poder utilizar o app",
      });

      setTimeout(() => {
        Linking.openSettings();
      }, 3000);
    }

    if (permission?.status !== "granted" && permission?.canAskAgain) {
      requestPermission();
    }

    if (permission?.status === "granted") {
      const { assets, canceled } = await launchCameraAsync();

      if (!canceled) {
        addImageToDocument(data, assets[0].uri);
      }
    }
  }

  const images = documents.find((doc) => doc.Chave === data.Chave)?.Image || [];

  const groupedImages = images.reduce((result, value, index) => {
    if (index % 2 === 0) result.push([value]);
    else result[result.length - 1].push(value);
    return result;
  }, [] as string[][]);

  useEffect(() => {}, [documents]);

  return (
    <VStack flex={1} px={"$8"} py={"$24"} alignItems={"center"}>
      <Icon
        //@ts-ignore
        name={"trash"}
        as={Feather}
        color={"$blue700"}
        position={"absolute"}
        top={"$16"}
        left={"$8"}
        size={"lg"}
        onPress={() => setAddDeleteDoclVisibility(true)}
      />

      <Icon
        //@ts-ignore
        name={"arrow-left"}
        as={Feather}
        color={"$blue700"}
        position={"absolute"}
        top={"$16"}
        right={"$8"}
        size={"lg"}
        onPress={() => navigation.goBack()}
      />

      <Heading fontSize={"$lg"} w={232} mb={"$4"} lineHeight={"$sm"}>
        {data?.Chave}
      </Heading>

      <HStack
        justifyContent={"space-around"}
        my={"$6"}
        borderBottomWidth={"$2"}
        borderBottomColor={"$blue700"}
        w={"$full"}
      >
        <HStack>
          <Text fontFamily={"$heading"} mr={"$2"} color={"$blue700"}>
            VALOR:
          </Text>
          <Text>R$ {Number(data?.TotalNfVlr).toFixed(2)}</Text>
        </HStack>

        <HStack>
          <Text fontFamily={"$heading"} mr={"$2"} color={"$blue700"}>
            NOTA:
          </Text>
          <Text>{data?.Numero}</Text>
        </HStack>
      </HStack>

      <HStack
        justifyContent={"space-around"}
        mb={"$4"}
        w={"$full"}
        alignItems={"center"}
      >
        <Text
          fontFamily={"$heading"}
          mr={"$2"}
          color={"$blue700"}
          fontSize={"$lg"}
          flex={1}
        >
          FOTOS
        </Text>

        <Icon
          as={AntDesign}
          //@ts-ignore
          name={"camera"}
          color={"$blue700"}
          size={"lg"}
          onPress={handleCameraSettings}
        />
      </HStack>

      <VStack>
        {groupedImages.map((imageGroup, rowIndex) => (
          <HStack key={rowIndex} justifyContent={"space-between"}>
            {imageGroup.map((imageUri, colIndex) => (
              <Pressable
                key={`${rowIndex}${colIndex}`}
                onPress={() => {
                  setSelectedImage(imageUri);
                }}
              >
                <Image
                  key={colIndex}
                  style={{
                    width: 160,
                    height: 160,
                    margin: 8,
                    borderWidth: 2,
                    borderColor: "black",
                  }}
                  source={{ uri: imageUri }}
                  alt="Foto das Notas Fiscais"
                />
              </Pressable>
            ))}
          </HStack>
        ))}
      </VStack>

      <Button
        title={"Concluir"}
        position={"absolute"}
        bottom={"$4"}
        onPress={() => navigation.goBack()}
      />

      <Dialog.Container visible={addDeleteDoclVisibility}>
        <Dialog.Title>Excluir</Dialog.Title>
        <Dialog.Description>
          Tem certeza que deseja excluir o documento?
        </Dialog.Description>
        <Dialog.Button
          label={"Excluir"}
          onPress={() => {
            removeDocument(data);
            setAddDeleteDoclVisibility(false);
            navigation.goBack();
          }}
        />
        <Dialog.Button
          label={"Cancelar"}
          onPress={() => {
            setAddDeleteDoclVisibility(false);
          }}
        />
      </Dialog.Container>

      <Modal
        visible={!!selectedImage}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSelectedImage("")}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
          }}
        >
          <Image
            style={{
              width: "90%",
              height: "70%",
              borderWidth: 2,
              borderColor: "white",
            }}
            source={{ uri: selectedImage }}
            alt="Foto das Notas Fiscais"
          />

          <HStack>
            <NBButton
              style={{ marginRight: 12 }}
              onPress={() => {
                removeImageFromDocument(data, selectedImage);
                setAddDeleteDoclVisibility(false);
                setSelectedImage("");
              }}
              mt={4}
              backgroundColor="red.500"
            >
              <Text bg={"$red500"} p={"$2"} rounded={"$lg"} color={"$white"}>
                Excluir
              </Text>
            </NBButton>

            <NBButton
              onPress={() => setSelectedImage("")}
              mt={2}
              backgroundColor="gray.500"
            >
              <Text bg={"$blue500"} p={"$2"} rounded={"$lg"} color={"$white"}>
                Fechar
              </Text>
            </NBButton>
          </HStack>
        </View>
      </Modal>
    </VStack>
  );
}
