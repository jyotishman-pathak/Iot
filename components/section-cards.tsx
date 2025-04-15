"use client"
import { useState, useEffect } from "react"
import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface SensorData {
  temperature: number
  humidity: number
  pressure: number
  createdAt: Date
}

export function SectionCards() {
  const [sensorData, setSensorData] = useState<SensorData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/fetchData')
        const data = await response.json()
        setSensorData(data)
      } catch (error) {
        console.error('Error fetching sensor data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
   
  }, [])

  
  const latestReading = sensorData[0]

  if (loading) {
    return <div className="p-4 text-muted-foreground">Loading sensor data...</div>
  }

  if (!latestReading) {
    return <div className="p-4 text-destructive">No sensor data available</div>
  }

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      
      
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Pressure</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {latestReading.pressure.toFixed(1)} kPa
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +2.1%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="flex gap-2 font-medium">
            Stable reading <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Within expected site limits
          </div>
        </CardFooter>
      </Card>

   
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Temperature</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {latestReading.temperature.toFixed(1)} °C
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingDown />
              -1.3%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="flex gap-2 font-medium">
            Slight drop <IconTrendingDown className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Check for environmental changes
          </div>
        </CardFooter>
      </Card>

   
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Humidity</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {latestReading.humidity.toFixed(1)}%
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="flex gap-2 font-medium">
            Rising levels <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Could affect sensor accuracy
          </div>
        </CardFooter>
      </Card>


      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Readings Analysis</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {sensorData.length} records
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +{sensorData.length}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="flex gap-2 font-medium">
            Data collection <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Last update: {new Date(latestReading.createdAt).toLocaleTimeString()}
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}