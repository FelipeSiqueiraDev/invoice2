import { useContext } from "react";
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";

import { Box } from "@gluestack-ui/themed";
import { gluestackUIConfig } from "@gluestack-ui/config";

import { AuthRoutes } from "./auth.routes";
import { useAuth } from "@hooks/useAuth";
import { DocumentContextProvider } from "@contexts/DocumentsContext";
import { ProgramRoutes } from "./program.routes";

export function Routes() {
  const theme = DefaultTheme;
  theme.colors.background = gluestackUIConfig.tokens.colors.coolGray100;

  const { logged } = useAuth();

  return (
    <Box flex={1} bg={"$coolGray100"}>
      <NavigationContainer theme={theme}>
        {logged ? (
          <DocumentContextProvider>
            <ProgramRoutes />
          </DocumentContextProvider>
        ) : (
          <AuthRoutes />
        )}
      </NavigationContainer>
    </Box>
  );
}
