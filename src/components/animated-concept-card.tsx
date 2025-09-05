import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface AnimatedConceptCardProps {
  icon: string
  color: string
  name: string
  description: string
  technicalDetails: string
  benefits: string[]
  challenges: string[]
  examples: string[]
}

export function AnimatedConceptCard({ 
  icon,
  color,
  name,
  description,
  technicalDetails,
  benefits,
  challenges,
  examples
}: AnimatedConceptCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
    >
      <Card className="h-full hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <CardTitle 
            className="flex items-center"
            style={{ color }}
          >
            <span className="mr-2 text-2xl">{icon}</span>
            {name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <motion.div 
              className="text-gray-700"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              {description}
            </motion.div>
            
            <motion.div 
              className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="font-semibold text-blue-800 mb-2">🔬 Detalles Técnicos</div>
              <div className="text-blue-700 text-sm">
                {technicalDetails}
              </div>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div 
                className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="font-semibold mb-2 text-green-800 flex items-center">
                  <span className="mr-2">✅</span>
                  Beneficios
                </div>
                <ul className="space-y-2">
                  {benefits.map((benefit, index) => (
                    <motion.li 
                      key={index} 
                      className="flex items-start"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.35 + index * 0.05 }}
                    >
                      <span className="mr-2 text-green-600">•</span>
                      <span className="text-gray-700">{benefit}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
              
              <motion.div 
                className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="font-semibold mb-2 text-red-800 flex items-center">
                  <span className="mr-2">⚠️</span>
                  Desafíos
                </div>
                <ul className="space-y-2">
                  {challenges.map((challenge, index) => (
                    <motion.li 
                      key={index} 
                      className="flex items-start"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.35 + index * 0.05 }}
                    >
                      <span className="mr-2 text-red-600">•</span>
                      <span className="text-gray-700">{challenge}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </div>
            
            <motion.div 
              className="bg-gray-50 p-4 rounded-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="font-semibold mb-2 text-gray-800">💡 Ejemplos:</div>
              <ul className="space-y-2">
                {examples.map((example, index) => (
                  <motion.li 
                    key={index} 
                    className="flex items-start"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.55 + index * 0.05 }}
                  >
                    <span className="mr-2 text-gray-500">•</span>
                    <span className="text-gray-700">{example}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}