
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import * as RechartsPrimitive from "recharts";

interface PieChartCardProps {
  title: string;
  description: string;
  data: {
    name: string;
    value: number;
  }[];
  colors: string[];
  chartConfig: {
    processos: {
      label: string;
      theme: {
        light: string;
        dark: string;
      };
    };
  };
}

const PieChartCard: React.FC<PieChartCardProps> = ({ 
  title, 
  description, 
  data, 
  colors,
  chartConfig 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-[4/3]">
          <RechartsPrimitive.ResponsiveContainer>
            <RechartsPrimitive.PieChart>
              <RechartsPrimitive.Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({name}) => name}
              >
                {data.map((entry, index) => (
                  <RechartsPrimitive.Cell 
                    key={`cell-${index}`} 
                    fill={colors[index % colors.length]} 
                  />
                ))}
              </RechartsPrimitive.Pie>
              <RechartsPrimitive.Tooltip />
            </RechartsPrimitive.PieChart>
          </RechartsPrimitive.ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default PieChartCard;
