import { motion, type HTMLMotionProps } from "framer-motion"
import { cn } from "@/lib/utils"

interface AnimatedDivProps extends Omit<HTMLMotionProps<"div">, 'transition'> {
  delay?: number
  duration?: number
}

export function AnimatedDiv({ 
  children, 
  className, 
  delay = 0, 
  duration = 0.5,
  ...props 
}: AnimatedDivProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration, delay }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  )
}