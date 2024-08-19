import { useRef, useState } from "react";
import {
  Center,
  FlatList,
  Heading,
  HStack,
  Icon,
  Pressable,
  Text,
  VStack,
} from "@gluestack-ui/themed";
import Dialog from "react-native-dialog";
import Toast from "react-native-toast-message";

import { Ionicons } from "@expo/vector-icons";

import { useDocument } from "@hooks/useDocuments";
import { uploadAllImages } from "@services/temporaryUpload";

import { api } from "@services/api";
import { ProgramNavigatorRoutesProps } from "@routes/program.routes";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";

import { Button } from "@components/Button";
import { Camera, ModalCameraHandles } from "@components/Camera";
import { InvoiceCard } from "@components/InvoiceCard";

import { InvoiceDTO } from "@dtos/InvoiceDTO";

export type ProgramRoutesParams = {
  invoiceList: {
    data: {
      CPF: string;
      licensePlate: string;
      destiny: string;
    };
  };
};

type InvoiceListRouteProp = RouteProp<ProgramRoutesParams, "invoiceList">;

export function InvoiceList() {
  const navigation = useNavigation<ProgramNavigatorRoutesProps>();

  const route = useRoute<InvoiceListRouteProp>();
  const { data } = route.params;

  const [addDocModalVisibility, setAddDocModalVisibility] = useState(false);
  const [docType, setDocType] = useState<string | null>(null);

  const { documents, setDocument, addDocument } = useDocument();

  const cameraRef = useRef<ModalCameraHandles>(null);

  async function handleAddDocument(data: string) {
    const isDuplicate = documents.some((doc) => doc.Chave === data);

    if (isDuplicate) {
      Toast.show({
        type: "error",
        text1: "Documento duplicado",
        text2: "O ducomento já está na lista",
      });
      cameraRef.current?.closeModal();
      return;
    }

    try {
      const settings = {
        Chave: data,
      };

      const {
        data: { Entity },
      } = await api.post(
        "/Services/Default/NotaFiscalEntrada/GetNotaFiscalEntradaByChave",
        settings
      );

      addDocument({ ...Entity, type: docType });
      //@ts-ignore
      navigation.navigate("invoicePage", { data: Entity, type: docType });
    } catch (err) {
      //@ts-ignore
      console.log(err.response);

      Toast.show({
        type: "error",
        text1: "Algo errado aconteceu",
        text2: "Ocorreu um erro inesperado, tente novamente",
      });

      cameraRef.current?.closeModal();
    }
  }

  async function handleSendDocuments() {
    try {
      for (const document of documents) {
        const images = document.Image;

        const uploadedImages = await uploadAllImages(images!);

        const invoiceInfo = {
          Chave: document.Chave,
          MotoristaCPF: data.CPF,
          Placa: data.licensePlate,
          EmpresaId: data.destiny,
          ImagePath: JSON.stringify(uploadedImages),
        };

        await api.post("Services/InvoiceApp/CheckPuxada", invoiceInfo);

        Toast.show({
          type: "success",
          text1: "tudo certo por aqui!",
          text2: "As notas foram registradas com sucesso!",
        });

        navigation.reset({ index: 0, routes: [{ name: "home" }] });
        setDocument([]);
      }
    } catch (error) {
      console.log(error);
      Toast.show({
        type: "error",
        text1: "Erro ao enviar os documentos",
        text2: "Algo deu errado, tente novamente mais tarde",
      });
    }
  }

  return (
    <Center flex={1} mt={"$20"}>
      <Heading>Documentos</Heading>

      <Camera onBarCodeScanned={handleAddDocument} ref={cameraRef} />

      <FlatList
        data={documents}
        //@ts-ignore
        keyExtractor={(item: InvoiceDTO) => item.Chave}
        showsVerticalScrollIndicator={false}
        style={{ height: 120, width: "90%", paddingTop: 12 }}
        //@ts-ignore
        renderItem={({ item }: { item: InvoiceDTO }) => (
          <InvoiceCard invoice={item} />
        )}
        ListEmptyComponent={() => (
          <Heading
            fontSize={"$3xl"}
            color={"$blue300"}
            mt={"$32"}
            textAlign={"center"}
          >
            LISTA VAZIA
          </Heading>
        )}
      />

      <HStack mx={"$12"} mb={"$2"}>
        <Button
          title={"Enviar"}
          disabled={documents?.length === 0}
          $disabled-bg={"gray200"}
          onPress={handleSendDocuments}
        />
        <Pressable
          w={"$14"}
          h={"$14"}
          marginLeft={"$4"}
          alignItems={"center"}
          justifyContent={"center"}
          bg={"$blue700"}
          rounded={"$full"}
          onPress={() => setAddDocModalVisibility(true)}
        >
          {/* @ts-ignore */}
          <Icon as={Ionicons} name={"add"} size={"md"} color={"white"} />
        </Pressable>

        <Dialog.Container visible={addDocModalVisibility}>
          <Dialog.Title>Ler Documento</Dialog.Title>
          <Dialog.Description>Qual o tipo do documento?</Dialog.Description>

          <Dialog.Button
            label={"NF"}
            onPress={() => {
              setDocType("NF");
              setAddDocModalVisibility(false);
              cameraRef.current?.openModal();
            }}
          />
          <Dialog.Button
            label={"Cancelar"}
            onPress={() => setAddDocModalVisibility(false)}
          />
        </Dialog.Container>
      </HStack>
    </Center>
  );
}
