import {
  forwardRef,
  ForwardRefRenderFunction,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import {
  Icon,
  Modal,
  IButtonProps,
  useDisclose,
  Box,
  Button as GlueButton,
} from "@gluestack/themed";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { ProgramNavigatorRoutesProps } from "@routes/program.routes";
import Dialog from "react-native-dialog";
import {
  CameraView,
  BarcodeScanningResult,
  useCameraPermissions,
} from "expo-camera";
import { Linking } from "react-native";
import Toast from "react-native-toast-message";

type Props = {
  onBarCodeScanned: (data: string) => void;
  trigger?: React.FC<IButtonProps>;
};

export type ModalCameraHandles = {
  openModal: () => void;
  closeModal: () => void;
};

const CameraComponent: ForwardRefRenderFunction<ModalCameraHandles, Props> = (
  { onBarCodeScanned, trigger: Trigger }: Props,
  ref
) => {
  const navigation = useNavigation<ProgramNavigatorRoutesProps>();
  const { isOpen, onOpen, onClose } = useDisclose();
  const [permission, requestPermission] = useCameraPermissions();
  const [writeDocCodeModalVisibility, setWriteDocCodeModalVisibility] =
    useState(false);
  const [docCode, setDocCode] = useState("");

  useImperativeHandle(ref, () => ({
    openModal: onOpen,
    closeModal: onClose,
  }));

  async function handleBarCodeScanned({ data }: BarcodeScanningResult) {
    console.log(data);
    onBarCodeScanned(data);
    // onClose();
  }

  async function handleCameraSettings() {
    if (permission?.status === "denied") {
      Toast.show({
        type: "error",
        text1: "Permissão da câmera necessária",
        text2: "Dê permissão a câmera para poder utilizar o app",
      });

      setTimeout(() => {
        Linking.openSettings();
      }, 3000);
    }

    if (permission?.status !== "granted" && permission?.canAskAgain) {
      requestPermission();
    }

    if (permission?.status === "granted") {
      onOpen();
    }
  }

  useEffect(() => {
    if (isOpen) {
      requestPermission();
    }
  }, [isOpen]);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="full">
        <Box
          h={12}
          w={12}
          bg={"blue.700"}
          rounded={"3xl"}
          right={8}
          position={"absolute"}
          zIndex={99}
          top={16}
          alignItems={"center"}
          justifyContent={"center"}
        >
          <Icon
            as={AntDesign}
            name={"back"}
            color={"white"}
            size={6}
            onPress={onClose}
          />
        </Box>

        <CameraView
          onBarcodeScanned={handleBarCodeScanned}
          barcodeScannerSettings={{ barcodeTypes: ["ean13"] }}
          style={{ flex: 1, width: "100%" }}
        />

        <Box bottom={4} zIndex={99} position={"absolute"} w={"100%"} px={4}>
          <GlueButton
            onPress={() => {
              setWriteDocCodeModalVisibility(true);
              onClose();
            }}
          >
            Digitar código
          </GlueButton>
        </Box>
      </Modal>

      <Dialog.Container
        visible={writeDocCodeModalVisibility}
        contentStyle={{ width: 300 }}
      >
        <Dialog.Title>Digite o código de barras do documento</Dialog.Title>
        <Dialog.Input
          placeholder="Digite o código de barras do documento"
          keyboardType="numeric"
          value={docCode}
          onChangeText={(text) => {
            if (text.length <= 44) {
              setDocCode(text);
            }
          }}
        />
        <Dialog.Button
          label={"Enviar"}
          onPress={() => {
            onBarCodeScanned(docCode);
            setWriteDocCodeModalVisibility(false);
            setDocCode("");
          }}
        />
        <Dialog.Button
          label={"Cancelar"}
          onPress={() => {
            setWriteDocCodeModalVisibility(false);
            onOpen();
            setDocCode("");
          }}
        />
      </Dialog.Container>
    </>
  );
};

export const Camera = forwardRef(CameraComponent);
