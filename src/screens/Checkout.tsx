import { useEffect, useRef, useState } from "react";
import { TextInput } from "react-native";
import { ScrollView, VStack, Heading, Icon, View } from "@gluestack-ui/themed";

import { Picker } from "@react-native-picker/picker";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";

import { api } from "@services/api";
import { useNavigation } from "@react-navigation/native";
import { ProgramNavigatorRoutesProps } from "@routes/program.routes";

import { DestinationsDTO } from "@dtos/DestinationsDTO";

import { Feather } from "@expo/vector-icons";

import { Input } from "@components/Input";
import { Button } from "@components/Button";

export type CheckoutFormProps = {
  CPF: string;
  licensePlate: string;
  destiny: string;
};

const checkoutSchema = yup.object().shape({
  CPF: yup.string().required("Informe o CPF do motorista"),
  licensePlate: yup.string().required("Informe a placa do veículo"),
  destiny: yup.string().required("Informe o destino"),
});

export function Checkout() {
  const [destinations, setDestinations] = useState<DestinationsDTO[]>([]);
  const navigation = useNavigation<ProgramNavigatorRoutesProps>();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormProps>({
    resolver: yupResolver(checkoutSchema),
  });

  async function handleGetDestinations() {
    try {
      const {
        data: { Entities },
      } = await api.post(
        "Services/InvoiceApp/ListEmpresaAppCheckPuxadaIsActive"
      );

      setDestinations(Entities);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleSendCheckoutForm(data: CheckoutFormProps) {
    navigation.navigate("invoiceList", { data });
  }

  useEffect(() => {
    handleGetDestinations();
  }, []);

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
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
          name={"CPF"}
          control={control}
          render={({ field: { onChange, value } }) => (
            <Input
              placeholder={"CPF"}
              keyboardType={"numeric"}
              autoCapitalize={"none"}
              onChangeText={onChange}
              value={value}
              formatType={"cpf"}
              errorMessage={errors.CPF?.message}
            />
          )}
        />

        <Controller
          name={"licensePlate"}
          control={control}
          render={({ field: { onChange, value } }) => (
            <Input
              placeholder={"Placa do veículo"}
              formatType={"licensePlate"}
              onChangeText={onChange}
              value={value}
              errorMessage={errors.licensePlate?.message}
            />
          )}
        />

        <Controller
          name={"destiny"}
          control={control}
          render={({ field: { onChange, value } }) => (
            <View
              style={{
                backgroundColor: "#F7F7F7",
                height: 56,
                width: "100%",
                paddingHorizontal: 16,
                marginBottom: 16,
                borderBottomWidth: 1,
                borderColor: "#7C7C8A",
                borderRadius: 8,
                justifyContent: "center",
              }}
            >
              <Picker
                selectedValue={value}
                style={{ height: 56, color: "$gray500" }}
                onValueChange={(itemValue) => onChange(itemValue)}
              >
                <Picker.Item label="Selecione o destino" value="" />
                {destinations?.map((destiny) => (
                  <Picker.Item
                    key={destiny.Id}
                    label={destiny.Nome}
                    value={String(destiny.Id)}
                  />
                ))}
              </Picker>
            </View>
          )}
        />

        <Button
          title={"Acessar"}
          onPress={handleSubmit(handleSendCheckoutForm)}
          mt={"$8"}
        />
      </VStack>
    </ScrollView>
  );
}
