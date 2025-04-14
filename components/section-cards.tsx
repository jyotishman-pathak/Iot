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

export function SectionCards() {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      
      {/* Pressure */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Pressure</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            100.2 kPa
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

      {/* Temperature */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Temperature</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            27.5 °C
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

      {/* Humidity */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Humidity</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            68%
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

      {/* Gas Level */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Gas Concentration</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            412 ppm
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +3.2%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="flex gap-2 font-medium">
            Monitor closely <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Slight increase from baseline
          </div>
        </CardFooter>
      </Card>

    </div>
  )
}
