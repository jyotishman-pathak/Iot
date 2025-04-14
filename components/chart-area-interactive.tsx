"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import { useIsMobile } from "@/hooks/use-mobile"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

export const description = "Land sensor data visualization"

const chartData = [
  { date: "2024-04-01", pressure: 222, temperature: 150, humidity: 75, gauges: 100 },
  { date: "2024-04-02", pressure: 97, temperature: 180, humidity: 82, gauges: 110 },
  { date: "2024-04-03", pressure: 167, temperature: 120, humidity: 65, gauges: 95 },
  { date: "2024-04-04", pressure: 242, temperature: 260, humidity: 90, gauges: 130 },
  // ... rest of the data points with pressure, temperature, humidity, and gauges values
] // Keep the same data structure but with updated sensor values

const chartConfig = {
  pressure: {
    label: "Pressure (kPa)",
    color: "#3b82f6", // Blue
  },
  temperature: {
    label: "Temperature (°C)",
    color: "#ef4444", // Red
  },
  humidity: {
    label: "Humidity (%)",
    color: "#22c55e", // Green
  },
  gauges: {
    label: "Gauges",
    color: "#eab308", // Yellow
  },
} satisfies ChartConfig

export function ChartAreaInteractive() {
  const isMobile = useIsMobile()
  const [selectedSensor, setSelectedSensor] = React.useState<keyof typeof chartConfig>("pressure")

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Land Sensor Metrics</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Visualize land sensor data in real-time
          </span>
          <span className="@[540px]/card:hidden">Sensor Data</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={selectedSensor}
            onValueChange={(v) => setSelectedSensor(v as keyof typeof chartConfig)}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="pressure">Pressure</ToggleGroupItem>
            <ToggleGroupItem value="temperature">Temperature</ToggleGroupItem>
            <ToggleGroupItem value="humidity">Humidity</ToggleGroupItem>
            <ToggleGroupItem value="gauges">Gauges</ToggleGroupItem>
          </ToggleGroup>
          <Select value={selectedSensor} onValueChange={(v) => setSelectedSensor(v as keyof typeof chartConfig)}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select sensor"
            >
              <SelectValue placeholder="Select sensor" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="pressure" className="rounded-lg">
                Pressure
              </SelectItem>
              <SelectItem value="temperature" className="rounded-lg">
                Temperature
              </SelectItem>
              <SelectItem value="humidity" className="rounded-lg">
                Humidity
              </SelectItem>
              <SelectItem value="gauges" className="rounded-lg">
                Gauges
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={chartData}>
            <defs>
              {Object.entries(chartConfig).map(([key, config]) => (
                <linearGradient
                  key={key}
                  id={`fill-${key}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor={config.color}
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor={config.color}
                    stopOpacity={0.1}
                  />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  }}
                  indicator="dashed"
                />
              }
            />
            <Area
              dataKey={selectedSensor}
              type="monotone"
              fill={`url(#fill-${selectedSensor})`}
              stroke={chartConfig[selectedSensor].color}
              strokeWidth={2}
              dot={false}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}