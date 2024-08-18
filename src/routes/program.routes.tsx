import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";

import { Home } from "@screens/Home";
import { Checkout, CheckoutFormProps } from "@screens/Checkout";
/* import { DocumentProps, InvoiceList } from "@screens/InvoiceList";
import { InvoicePage } from "@screens/InvoicePage"; */
import { InvoiceDTO } from "@dtos/InvoiceDTO";
import { InvoiceList } from "@screens/InvoiceList";

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
      <Screen name="home" component={Home} />
      <Screen name="checkout" component={Checkout} />
      <Screen name="invoiceList" component={InvoiceList} />
      {/* <Screen name="invoicePage" component={InvoicePage} /> */}
    </Navigator>
  );
}
