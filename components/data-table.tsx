"use client"

import * as React from "react"
import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconCircleCheckFilled,
  IconDotsVertical,
  IconGripVertical,
  IconLayoutColumns,
  IconLoader,
  IconPlus,
  IconTrendingUp,
} from "@tabler/icons-react"
import {
  ColumnDef,
  ColumnFiltersState,
  Row,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { toast } from "sonner"

import { useIsMobile } from "@/hooks/use-mobile"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"

interface SensorData {
  id: number
  createdAt: string
  pressure: number
  temperature: number
  humidity: number
  status: "normal" | "alert" | "critical"
}

const chartConfig = {
  temperature: {
    label: "Temperature (°C)",
    color: "#ef4444",
  },
  humidity: {
    label: "Humidity (%)",
    color: "#22c55e",
  },
  pressure: {
    label: "Pressure (kPa)",
    color: "#3b82f6",
  }
} satisfies ChartConfig

function DragHandle({ id }: { id: number }) {
  const { attributes, listeners } = useSortable({ id })

  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className="text-muted-foreground size-7 hover:bg-transparent"
    >
      <IconGripVertical className="text-muted-foreground size-3" />
      <span className="sr-only">Drag to reorder</span>
    </Button>
  )
}

const columns: ColumnDef<SensorData>[] = [
  {
    id: "drag",
    header: () => null,
    cell: ({ row }) => <DragHandle id={row.original.id} />,
  },
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: "Sensor ID",
    enableHiding: false,
  },
  {
    accessorKey: "pressure",
    header: "Pressure (kPa)",
    cell: ({ row }) => row.original.pressure.toFixed(1)
  },
  {
    accessorKey: "temperature",
    header: "Temp (°C)",
    cell: ({ row }) => row.original.temperature.toFixed(1)
  },
  {
    accessorKey: "humidity",
    header: "Humidity (%)",
    cell: ({ row }) => row.original.humidity.toFixed(1)
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const statusColors = {
        normal: "bg-green-500",
        alert: "bg-yellow-500",
        critical: "bg-red-500"
      }
      return (
        <div className="flex items-center gap-2">
          <div className={`size-2 rounded-full ${statusColors[row.original.status]}`} />
          <span className="capitalize">{row.original.status}</span>
        </div>
      )
    }
  },
  {
    id: "actions",
    cell: () => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
            size="icon"
          >
            <IconDotsVertical />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuItem>Details</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]

function DraggableRow({ row }: { row: Row<SensorData> }) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.id,
  })

  return (
    <TableRow
      data-state={row.getIsSelected() && "selected"}
      data-dragging={isDragging}
      ref={setNodeRef}
      className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  )
}

export function SensorDataTable() {
  const [data, setData] = React.useState<SensorData[]>([])
  const [loading, setLoading] = React.useState(true)
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  })
  const sortableId = React.useId()
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  )

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/fetchData')
        const sensorData = await response.json()
        setData(sensorData)
      } catch (error) {
        toast.error("Failed to fetch sensor data")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 5000)
    return () => clearInterval(interval)
  }, [])

  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => data?.map(({ id }) => id) || [],
    [data]
  )

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.id.toString(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (active && over && active.id !== over.id) {
      setData((data) => {
        const oldIndex = dataIds.indexOf(active.id)
        const newIndex = dataIds.indexOf(over.id)
        return arrayMove(data, oldIndex, newIndex)
      })
    }
  }

  if (loading) return <div className="p-4">Loading sensors...</div>

  return (
    <Tabs defaultValue="overview">
      <div className="flex items-center justify-between px-4 lg:px-6">
        <TabsList className="hidden @4xl/main:flex">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
        </TabsList>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <IconLayoutColumns />
                <span className="hidden lg:inline">Columns</span>
                <IconChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {table
                .getAllColumns()
                .filter(
                  (column) =>
                    typeof column.accessorFn !== "undefined" &&
                    column.getCanHide()
                )
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" size="sm">
            <IconPlus />
            <span className="hidden lg:inline">Add Sensor</span>
          </Button>
        </div>
      </div>
      
      <TabsContent value="overview" className="p-4 lg:p-6">
        <div className="overflow-hidden rounded-lg border">
          <DndContext
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={handleDragEnd}
            sensors={sensors}
            id={sortableId}
          >
            <Table>
              <TableHeader className="bg-muted sticky top-0 z-10">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id} colSpan={header.colSpan}>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  <SortableContext
                    items={dataIds}
                    strategy={verticalListSortingStrategy}
                  >
                    {table.getRowModel().rows.map((row) => (
                      <DraggableRow key={row.id} row={row} />
                    ))}
                  </SortableContext>
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      No sensors found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </DndContext>
        </div>
        
        {/* Pagination controls */}
        <div className="flex items-center justify-between p-4">
          <div className="text-muted-foreground text-sm">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} selected
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Label>Rows per page</Label>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => table.setPageSize(Number(value))}
              >
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[10, 20, 30].map((size) => (
                    <SelectItem key={size} value={`${size}`}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <IconChevronLeft />
              </Button>
              <Button
                variant="outline"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <IconChevronRight />
              </Button>
            </div>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="details" className="p-4 lg:p-6">
        <div className="grid @md:grid-cols-2 @lg:grid-cols-3 gap-4">
          {data.map((sensor) => (
            <SensorCard key={sensor.id} sensor={sensor} />
          ))}
        </div>
      </TabsContent>
    </Tabs>
  )
}

function SensorCard({ sensor }: { sensor: SensorData }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sensor #{sensor.id}</CardTitle>
        <CardDescription>
          Last update: {new Date(sensor.createdAt).toLocaleTimeString()}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-3 gap-4">
        <div>
          <div className="text-muted-foreground text-sm">Pressure</div>
          <div className="text-xl font-semibold">{sensor.pressure} kPa</div>
        </div>
        <div>
          <div className="text-muted-foreground text-sm">Temperature</div>
          <div className="text-xl font-semibold">{sensor.temperature}°C</div>
        </div>
        <div>
          <div className="text-muted-foreground text-sm">Humidity</div>
          <div className="text-xl font-semibold">{sensor.humidity}%</div>
        </div>
      </CardContent>
    </Card>
  )
}

function TableCellViewer({ item }: { item: SensorData }) {
  const isMobile = useIsMobile()
  const [history, setHistory] = React.useState<SensorData[]>([])

  React.useEffect(() => {
    fetch(`/api/sensor/${item.id}`)
      .then(res => res.json())
      .then(data => setHistory(data))
  }, [item.id])

  return (
    <Drawer direction={isMobile ? "bottom" : "right"}>
      <DrawerTrigger asChild>
        <Button variant="link" className="text-foreground px-0">
          Details
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Sensor #{item.id}</DrawerTitle>
          <DrawerDescription>
            Detailed metrics and history
          </DrawerDescription>
        </DrawerHeader>
        
        <div className="p-4 space-y-6">
          <ChartContainer config={chartConfig}>
            <AreaChart data={history}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="createdAt"
                tickFormatter={time => new Date(time).toLocaleTimeString()}
              />
              <ChartTooltip
                content={<ChartTooltipContent indicator="dashed" />}
              />
              <Area
                dataKey="temperature"
                fill="#ef444433"
                stroke="#ef4444"
              />
              <Area
                dataKey="humidity"
                fill="#22c55e33"
                stroke="#22c55e"
              />
              <Area
                dataKey="pressure"
                fill="#3b82f633"
                stroke="#3b82f6"
              />
            </AreaChart>
          </ChartContainer>

          <div className="grid @md:grid-cols-3 gap-4">
            <StatCard title="Current Pressure" value={`${item.pressure} kPa`} />
            <StatCard title="Temperature" value={`${item.temperature}°C`} />
            <StatCard title="Humidity" value={`${item.humidity}%`} />
          </div>
        </div>
        
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-lg border p-4">
      <div className="text-muted-foreground text-sm">{title}</div>
      <div className="text-2xl font-semibold">{value}</div>
    </div>
  )
}