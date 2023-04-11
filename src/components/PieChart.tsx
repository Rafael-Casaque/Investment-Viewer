import { VictoryPie } from "victory-pie";
import { Stock } from "./types/stock";
import { ColorScalePropType } from "victory";
import { Flex, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";

interface PieChartProps {
  stocks: Stock[];
  color: ColorScalePropType | undefined;
}

export const PieChart = ({ stocks, color }: PieChartProps) => {
  
  const [participation, setParticipation] = useState<string | null>(null);
  const [showParticipation, setShowParticipation] = useState(false);

  useEffect(()=>{
    if(participation === null){
      setShowParticipation(false)
    }
    else{
      setShowParticipation(true)
    }
  },[participation])

  const handleMouseOver = (event: any, data: any) => {  
    setParticipation(formatPercent(data.datum.y))
  };

  const handleMouseOut = (event: any, data: any) => {  
    setParticipation(null)
  };

  const convertStocks = stocks.map((stock) => {
    return {
      x: stock.name,
      y: stock.participation,
    };
  });

  return (
    <Flex w="50%" alignItems="center" justifyContent="center">
      <Flex
        w="15%"
        h="30%"
        borderRadius="50%"
        bg="black"
        color="white"
        position="absolute"
        alignItems="center"
        justifyContent="center"

        display={showParticipation?"flex":"none"}
      >
        <Text fontSize="30px">{participation}</Text>
      </Flex>
      <VictoryPie
        padAngle={({ datum }) => datum.y + 1}
        innerRadius={100}
        labelRadius={115}
        colorScale={color}
        data={convertStocks}
        events={[
          {
            target: "data",
            eventHandlers: {
              onMouseOver: handleMouseOver,
              onMouseOut: handleMouseOut,
            },
          },
        ]}
      />
    </Flex>
  );
};

const formatPercent = (value: number) => {
  return `${(value * 100).toFixed(2)}%`;
};
