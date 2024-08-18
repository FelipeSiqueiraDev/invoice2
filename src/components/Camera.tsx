import {
  forwardRef,
  ForwardRefRenderFunction,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { IButtonProps, Icon, Modal } from "@gluestack-ui/themed";
import Dialog from "react-native-dialog";

import { Feather } from "@expo/vector-icons";

import { useDisclose } from "@services/useDisclose";

import {
  CameraView,
  BarcodeScanningResult,
  useCameraPermissions,
} from "expo-camera";
import { BarCodeScanningResult } from "expo-camera/build/legacy/Camera.types";
import { Button } from "./Button";

export type ModalCameraHandles = {
  openModal: () => void;
  closeModal: () => void;
};

type Props = {
  onBarCodeScanned: (data: string) => void;
  trigger?: React.FC<IButtonProps>;
};

const CameraComponent: ForwardRefRenderFunction<ModalCameraHandles, Props> = (
  { onBarCodeScanned, trigger: Trigger }: Props,
  ref
) => {
  const { isOpen, onOpen, onClose } = useDisclose();
  const [permission, requestPermission] = useCameraPermissions();
  const [writeDocCodeModalVisibility, SetWriteDocCodeModalVisibility] =
    useState(false);
  const [docCode, setDocCode] = useState("");

  useImperativeHandle(ref, () => {
    return {
      openModal: onOpen,
      closeModal: onClose,
    };
  });

  async function handleBarcodeScanned({ data }: BarCodeScanningResult) {
    console.log(data);
    onBarCodeScanned(data);
  }

  useEffect(() => {
    if (isOpen) {
      requestPermission();
    }
  }, [isOpen]);

  return (
    <>
      <Modal flex={1} isOpen={isOpen}>
        <Icon
          //@ts-ignore
          name={"arrow-left"}
          as={Feather}
          color={"$blue700"}
          position={"absolute"}
          top={"$16"}
          right={"$8"}
          size={"lg"}
          onPress={onClose}
        />

        <CameraView
          onBarcodeScanned={handleBarcodeScanned}
          barcodeScannerSettings={{ barcodeTypes: ["ean13"] }}
          style={{ flex: 1, width: "100%" }}
        />

        <Button
          title={"Digitar o código"}
          onPress={() => {
            SetWriteDocCodeModalVisibility(true), onClose();
          }}
        />
      </Modal>

      <Dialog.Container
        visible={writeDocCodeModalVisibility}
        contentStyle={{ width: 350 }}
      >
        <Dialog.Title>Digite o código de barras do documento</Dialog.Title>
        <Dialog.Input
          placeholder={"Digite o código de barras do documento"}
          keyboardType={"numeric"}
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
            SetWriteDocCodeModalVisibility(false);
            setDocCode("");
          }}
        />

        <Dialog.Button
          label={"Cancelar"}
          onPress={() => {
            SetWriteDocCodeModalVisibility(false);
            onOpen();
            setDocCode("");
          }}
        />
      </Dialog.Container>
    </>
  );
};

export const Camera = forwardRef(CameraComponent);
