import {
  Icon,
  HStack,
  Pressable,
  Text,
  VStack,
  Heading,
} from "@gluestack-ui/themed";

import { Ionicons } from "@expo/vector-icons";

interface InvoiceCardProp {
  Chave: string;
  type?: string;
}

export function InvoiceCard({ Chave, type }: InvoiceCardProp) {
  return (
    <Pressable>
      <HStack w={"$full"} alignItems={"center"} px={"$2"}>
        <VStack w={"$10"} alignItems={"center"} justifyContent={"center"}>
          <Icon
            as={Ionicons}
            //@ts-ignore
            name={type === "NF" ? "document-text" : "document-text-outline"}
          />

          <Text>{type ?? "Doc"}</Text>
        </VStack>

        <Heading
          textAlign={"left"}
          fontFamily={"$heading"}
          fontSize={"$sm"}
          color={"$blue700"}
          w={"$16"}
          ml={"$12"}
        >
          {Chave}
        </Heading>
      </HStack>
    </Pressable>
  );
}
