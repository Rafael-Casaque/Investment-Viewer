import { PieChart } from "@/components/PieChart";

export const Dashboard = () => {
  return (
    <PieChart
      color={"qualitative"}
      stocks={[
        { name: "RECT11", participation: 0.15 },
        { name: "BCFF11", participation: 0.2 },
        { name: "HGLG11", participation: 0.25 },
        { name: "MXRF11", participation: 0.1 },
        { name: "RECT11", participation: 0.1 },
        { name: "BCFF11", participation: 0.1 },
      ]}
    />
  );
};
