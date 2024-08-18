import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";

import { InvoiceDTO } from "@dtos/InvoiceDTO";

import { Home } from "@screens/Home";
import { Checkout, CheckoutFormProps } from "@screens/Checkout";
import { InvoiceList } from "@screens/InvoiceList";
import { InvoicePage } from "@screens/InvoicePage";

export type ProgramRoutes = {
  home: undefined;
  checkout: undefined;
  invoiceList: {
    data: CheckoutFormProps;
  };
  invoicePage: {
    data: InvoiceDTO;
  };
};

export type ProgramNavigatorRoutesProps =
  NativeStackNavigationProp<ProgramRoutes>;

const { Navigator, Screen } = createNativeStackNavigator<ProgramRoutes>();

export function ProgramRoutes() {
  return (
    <Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Screen name="invoicePage" component={InvoicePage} />
      <Screen name="home" component={Home} />
      <Screen name="checkout" component={Checkout} />
      <Screen name="invoiceList" component={InvoiceList} />
    </Navigator>
  );
}
