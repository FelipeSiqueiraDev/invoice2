import {
  Icon,
  HStack,
  Pressable,
  Text,
  VStack,
  Heading,
} from "@gluestack-ui/themed";

import { Ionicons } from "@expo/vector-icons";

import { InvoiceDTO } from "@dtos/InvoiceDTO";
interface InvoiceCardProps {
  invoice: InvoiceDTO;
  type?: string;
}

import { useNavigation } from "@react-navigation/native";
import { ProgramNavigatorRoutesProps } from "@routes/program.routes";

export function InvoiceCard({ invoice, type }: InvoiceCardProps) {
  const navigation = useNavigation<ProgramNavigatorRoutesProps>();

  const firstLine = invoice.Chave.substring(0, 22);
  const secondLine = invoice.Chave.substring(22, 44);
  return (
    <Pressable
      w={"$full"}
      h={"$20"}
      bg={"$blue200"}
      mb={"$2"}
      justifyContent={"center"}
      rounded={"$lg"}
      onPress={() => navigation.navigate("invoicePage", { data: invoice })}
    >
      <HStack w={"$full"} px={"$5"}>
        <VStack w={"$10"} alignItems={"center"} justifyContent={"center"}>
          <Icon
            color={"$blue500"}
            as={Ionicons}
            //@ts-ignore
            name={type === "NF" ? "document-text" : "document-text-outline"}
          />

          <Text color={"$blue500"} fontSize={"$lg"}>
            {invoice.type ?? "Doc"}
          </Text>
        </VStack>

        <VStack ml={"$12"}>
          <Text
            textAlign={"left"}
            fontFamily={"$heading"}
            fontSize={"$md"}
            color={"$blue700"}
          >
            {firstLine}
          </Text>
          <Text
            textAlign={"left"}
            fontFamily={"$heading"}
            fontSize={"$md"}
            color={"$blue700"}
          >
            {secondLine}
          </Text>
        </VStack>
      </HStack>
    </Pressable>
  );
}
