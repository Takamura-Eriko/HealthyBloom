import * as React from "react"

const Chart = React.forwardRef<React.ElementRef<"div">, React.ComponentPropsWithoutRef<"div">>(
  ({ className, ...props }, ref) => <div className={className} ref={ref} {...props} />,
)
Chart.displayName = "Chart"

const ChartContainer = React.forwardRef<React.ElementRef<"div">, React.ComponentPropsWithoutRef<"div">>(
  ({ className, ...props }, ref) => <div className={className} ref={ref} {...props} />,
)
ChartContainer.displayName = "ChartContainer"

interface ChartTooltipContentProps {
  children: React.ReactNode
}

const ChartTooltipContent = ({ children }: ChartTooltipContentProps) => {
  return <div className="rounded-md border bg-popover p-4 shadow-sm">{children}</div>
}

interface ChartTooltipItemProps {
  label: string
  value: string
  color?: string
}

const ChartTooltipItem = ({ label, value, color }: ChartTooltipItemProps) => {
  return (
    <div className="flex items-center space-x-2">
      {color && <span className="block h-2 w-2 rounded-full" style={{ backgroundColor: color }} />}
      <span className="text-xs font-semibold">{label}:</span>
      <span className="text-xs">{value}</span>
    </div>
  )
}

const ChartTooltip = React.forwardRef<React.ElementRef<"div">, React.ComponentPropsWithoutRef<"div">>(
  ({ className, ...props }, ref) => <div className={className} ref={ref} {...props} />,
)
ChartTooltip.displayName = "ChartTooltip"

export { Chart, ChartContainer, ChartTooltip, ChartTooltipContent, ChartTooltipItem }

