import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import { Initial } from "@screens/Initial";
import { SingIn } from "@screens/SignIn";

type AuthRoutes = {
  initial: undefined;
  signIn: undefined;
};

export type AuthNavigatorRoutesProps = NativeStackNavigationProp<AuthRoutes>;

const { Navigator, Screen } = createNativeStackNavigator<AuthRoutes>();

export function AuthRoutes() {
  return (
    <Navigator screenOptions={{ headerShown: false }}>
      <Screen name={"initial"} component={Initial} />
      <Screen name={"signIn"} component={SingIn} />
    </Navigator>
  );
}
