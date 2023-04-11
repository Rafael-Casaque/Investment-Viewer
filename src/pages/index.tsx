import { Dashboard } from "@/modules/Dashboard";
import { ChakraProvider } from "@chakra-ui/react";

export default function Index() {
  return (
    <ChakraProvider>
      <Dashboard />
    </ChakraProvider>
  );
}
