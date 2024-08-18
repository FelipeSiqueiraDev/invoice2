import { ComponentProps } from "react";
import {
  ButtonSpinner,
  Button as GluestackButton,
  Text,
} from "@gluestack-ui/themed";
import { Loading } from "./Loading";

type Props = ComponentProps<typeof GluestackButton> & {
  title: string;
  isLoading?: boolean;
};

export function Button({ title, isLoading = false, ...rest }: Props) {
  return (
    <GluestackButton
      h={"$14"}
      w={"$full"}
      rounded={"$sm"}
      bg={"$blue700"}
      borderWidth={"$0"}
      disabled={isLoading}
      borderColor={"$blue500"}
      $active-bg={"$blue500"}
      {...rest}
    >
      {isLoading ? (
        <ButtonSpinner />
      ) : (
        <Text color={"$white"} fontFamily={"$heading"} fontSize={"$sm"}>
          {title}
        </Text>
      )}
    </GluestackButton>
  );
}
