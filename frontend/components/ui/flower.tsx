import * as React from "react"
import { LucideFlower } from "lucide-react"

interface FlowerProps extends React.ComponentProps<typeof LucideFlower> {}

const Flower = React.forwardRef<React.ElementRef<"svg">, FlowerProps>(({ className, ...props }, ref) => (
  <LucideFlower ref={ref} className={className} {...props} />
))
Flower.displayName = "Flower"

export { Flower }

