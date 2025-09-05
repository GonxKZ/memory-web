import * as React from "react"
import { cn } from "@/lib/utils"

const TestComponent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("p-4 border rounded-md", className)}
    {...props}
  />
))
TestComponent.displayName = "TestComponent"

export { TestComponent }