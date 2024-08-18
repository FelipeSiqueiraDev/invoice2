import {
  Input as GluestackInput,
  InputField,
  FormControl,
} from "@gluestack-ui/themed";
import { ComponentProps } from "react";

type Props = ComponentProps<typeof InputField> & {
  errorMessage?: string | null;
  formatType?: string;
};

function formatCPF(text: string) {
  text = text.replace(/\D/g, "");
  if (text.length <= 3) {
    return text;
  } else if (text.length <= 6) {
    return `${text.slice(0, 3)}.${text.slice(3)}`;
  } else if (text.length <= 9) {
    return `${text.slice(0, 3)}.${text.slice(3, 6)}.${text.slice(6)}`;
  } else {
    return `${text.slice(0, 3)}.${text.slice(3, 6)}.${text.slice(
      6,
      9
    )}-${text.slice(9, 11)}`;
  }
}

function formatPlate(text: string) {
  text = text.replace(/[^a-zA-Z0-9]/g, "");
  if (text.length <= 3) {
    return text.toUpperCase();
  } else if (text.length <= 7) {
    return `${text.slice(0, 3).toUpperCase()}-${text.slice(3).toUpperCase()}`;
  } else {
    return `${text.slice(0, 3).toUpperCase()}-${text
      .slice(3, 7)
      .toUpperCase()}`;
  }
}

export function Input({
  errorMessage = null,
  formatType = "default",
  onChangeText,
  ...rest
}: Props) {
  function handleChangeText(text: string) {
    const formattedText =
      formatType === "default"
        ? text
        : formatType === "cpf"
        ? formatCPF(text)
        : formatPlate(text);
    if (onChangeText) {
      onChangeText(formattedText);
    }
  }

  return (
    <GluestackInput
      bg={"$coolGray100"}
      h={"$14"}
      px={"$4"}
      mb={!!errorMessage ? "$2" : "$4"}
      borderWidth={"$0"}
      borderBottomWidth={"$1"}
      borderColor="$gray300"
      borderRadius={"$md"}
      $focus={{
        borderWidth: 1,
        borderColor: "$blue500",
      }}
    >
      <InputField
        color={"$gray900"}
        fontFamily={"$body"}
        placeholderTextColor={"$gray300"}
        onChangeText={handleChangeText}
        {...rest}
      />
    </GluestackInput>
  );
}
