import { Flex } from "@chakra-ui/react";
import { VictoryStack } from "victory-stack";
import { VictoryLabel } from "victory";
import { VictoryChart } from "victory-chart";
import { VictoryBar } from "victory-bar";
import { VictoryAxis } from "victory-axis";
import { StockBars } from "../types/stock";

interface StackedBarsProps {
  participation: StockBars[];
  dividend: StockBars[];
  participationColor: string;
  dividendColor: string;
}

export const StackedBars = ({
  participation,
  dividend,
  participationColor,
  dividendColor,
}: StackedBarsProps) => {
  return (
    <Flex w="50%">
      <VictoryChart horizontal height={400} width={400} padding={40}>
        <VictoryStack style={{ data: { width: 25 }, labels: { fontSize: 15 } }}>
          <VictoryBar
            style={{ data: { fill: participationColor } }}
            data={participation}
            y={(data) => -Math.abs(data.y)}
            labels={({ datum }) => `${Math.abs(datum.y)}%`}
          />
          <VictoryBar
            style={{ data: { fill: dividendColor } }}
            data={dividend}
            labels={({ datum }) => `${Math.abs(datum.y)}%`}
          />
        </VictoryStack>

        <VictoryAxis
          style={{
            axis: { stroke: "transparent" },
            ticks: { stroke: "transparent" },
            tickLabels: { fontSize: 15, fill: "black" },
          }}
          tickLabelComponent={<VictoryLabel x={400 / 2} textAnchor="middle" />}
          tickValues={participation.map((point) => point.x).reverse()}
        />
      </VictoryChart>
    </Flex>
  );
};
