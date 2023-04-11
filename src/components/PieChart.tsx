import { VictoryPie } from "victory-pie";
import { Stock } from "./types/stock";
import { ColorScalePropType } from "victory";

interface PieChartProps {
  stocks: Stock[];
  color: ColorScalePropType | undefined
}

export const PieChart = ({ stocks, color }: PieChartProps) => {

  const convertStocks = stocks.map((stock) => {
    return {
      x: stock.name,
      y: stock.participation,
    };
  });

  return (
    <VictoryPie
      padAngle={({ datum }) => datum.y / 30}
      innerRadius={100}
      labelRadius={115}
      colorScale={color}
      data={convertStocks}
    />
  );
};
