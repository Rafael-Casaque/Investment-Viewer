import { PieChart } from "@/components/PieChart";
import { Box, ChakraProvider, Flex } from "@chakra-ui/react";

export default function Index() {
  return (
    <ChakraProvider>
      <Flex align="center" w="100%" justifyContent="center">
        <Box w="50%">
          <PieChart
            color={"qualitative"}
            stocks={[
              { name: "RECT11", participation: 0.15 },
              { name: "BCFF11", participation: 0.20 },
              { name: "HGLG11", participation: 0.25 },
              { name: "MXRF11", participation: 0.10 },              
              { name: "RECT11", participation: 0.10 },
              { name: "BCFF11", participation: 0.10 },
            ]}
          />
        </Box>
      </Flex>
    </ChakraProvider>
  );
}
