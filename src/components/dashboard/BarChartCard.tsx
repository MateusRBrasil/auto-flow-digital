
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import * as RechartsPrimitive from "recharts";

interface BarChartCardProps {
  title: string;
  description: string;
  data: {
    name: string;
    processos: number;
  }[];
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

const BarChartCard: React.FC<BarChartCardProps> = ({ 
  title, 
  description, 
  data, 
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
            <RechartsPrimitive.BarChart data={data}>
              <RechartsPrimitive.CartesianGrid strokeDasharray="3 3" />
              <RechartsPrimitive.XAxis dataKey="name" />
              <RechartsPrimitive.YAxis />
              <RechartsPrimitive.Tooltip />
              <RechartsPrimitive.Bar dataKey="processos" fill="var(--color-processos)" />
            </RechartsPrimitive.BarChart>
          </RechartsPrimitive.ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default BarChartCard;
