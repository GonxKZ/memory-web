import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface MatrixTileProps {
  tileSize: number
  matrixA: number[][]
  matrixB: number[][]
  matrixC: number[][]
  currentTile: { row: number; col: number } | null
  onTileClick?: (row: number, col: number) => void
}

export function MatrixTile({ 
  tileSize,
  matrixA,
  matrixB,
  matrixC,
  currentTile,
  onTileClick
}: MatrixTileProps) {
  // Calculate matrix dimensions
  const rows = matrixC.length
  const cols = matrixC[0].length
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Operaciones Matriciales con Tiling</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
          <div className="font-semibold text-blue-800">¿Qué es el Tiling?</div>
          <div className="text-sm text-blue-700 mt-1">
            El tiling divide matrices grandes en bloques más pequeños (tiles) para mejorar 
            la localidad de datos y la eficiencia de la caché.
          </div>
        </div>
        
        <div className="mb-4">
          <div className="font-semibold mb-2">Tamaño del tile: {tileSize}x{tileSize}</div>
          <div className="text-sm text-gray-500 mb-2">
            Matriz C ({rows}x{cols}) = Matriz A ({matrixA.length}x{matrixA[0].length}) × Matriz B ({matrixB.length}x{matrixB[0].length})
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <div 
            className="inline-block relative"
            style={{ 
              width: `${cols * 40 + 40}px`, 
              height: `${rows * 40 + 40}px` 
            }}
          >
            {/* Column headers */}
            {Array.from({ length: cols }).map((_, col) => (
              <div
                key={`col-${col}`}
                className="absolute font-mono text-xs text-center"
                style={{
                  left: `${col * 40 + 40}px`,
                  top: '0px',
                  width: '40px'
                }}
              >
                {col}
              </div>
            ))}
            
            {/* Row headers */}
            {Array.from({ length: rows }).map((_, row) => (
              <div
                key={`row-${row}`}
                className="absolute font-mono text-xs text-center"
                style={{
                  left: '0px',
                  top: `${row * 40 + 40}px`,
                  width: '40px'
                }}
              >
                {row}
              </div>
            ))}
            
            {/* Matrix cells */}
            {matrixC.map((row, rowIndex) => 
              row.map((value, colIndex) => {
                // Calculate which tile this cell belongs to
                const tileRow = Math.floor(rowIndex / tileSize)
                const tileCol = Math.floor(colIndex / tileSize)
                const isCurrentTile = currentTile && 
                  currentTile.row === tileRow && 
                  currentTile.col === tileCol
                
                return (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className={`
                      absolute border flex items-center justify-center text-xs font-mono cursor-pointer
                      ${isCurrentTile 
                        ? "bg-blue-500 text-white border-blue-700" 
                        : "bg-white border-gray-300"}
                    `}
                    style={{
                      left: `${colIndex * 40 + 40}px`,
                      top: `${rowIndex * 40 + 40}px`,
                      width: '40px',
                      height: '40px'
                    }}
                    onClick={() => onTileClick?.(tileRow, tileCol)}
                  >
                    {value}
                  </div>
                )
              })
            )}
            
            {/* Tile boundaries */}
            {Array.from({ length: Math.ceil(rows / tileSize) }).map((_, tileRow) => 
              Array.from({ length: Math.ceil(cols / tileSize) }).map((_, tileCol) => {
                const isCurrentTile = currentTile && 
                  currentTile.row === tileRow && 
                  currentTile.col === tileCol
                
                return (
                  <div
                    key={`tile-${tileRow}-${tileCol}`}
                    className={`
                      absolute border-2 border-dashed
                      ${isCurrentTile 
                        ? "border-blue-500" 
                        : "border-gray-400"}
                    `}
                    style={{
                      left: `${tileCol * tileSize * 40 + 40}px`,
                      top: `${tileRow * tileSize * 40 + 40}px`,
                      width: `${tileSize * 40}px`,
                      height: `${tileSize * 40}px`
                    }}
                  ></div>
                )
              })
            )}
          </div>
        </div>
        
        {currentTile && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
            <div className="font-semibold text-blue-800">
              Tile actual: ({currentTile.row}, {currentTile.col})
            </div>
            <div className="text-sm text-blue-700 mt-1">
              Procesando submatriz de {tileSize}x{tileSize} elementos
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

interface TilingBenefitsProps {
  benefits: {
    name: string
    description: string
    improvement: string
  }[]
}

export function TilingBenefits({ benefits }: TilingBenefitsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Beneficios del Tiling</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {benefits.map((benefit, index) => (
            <div key={index} className="p-3 bg-gray-50 rounded">
              <div className="font-semibold">{benefit.name}</div>
              <div className="text-sm text-gray-600 mt-1">
                {benefit.description}
              </div>
              <div className="text-sm font-semibold text-green-600 mt-1">
                Mejora: {benefit.improvement}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

interface CacheEfficiencyProps {
  withoutTiling: {
    cacheHits: number
    cacheMisses: number
    memoryAccesses: number
  }
  withTiling: {
    cacheHits: number
    cacheMisses: number
    memoryAccesses: number
  }
}

export function CacheEfficiency({ 
  withoutTiling,
  withTiling
}: CacheEfficiencyProps) {
  // Calculate hit rates
  const withoutTilingHitRate = withoutTiling.memoryAccesses > 0 
    ? (withoutTiling.cacheHits / withoutTiling.memoryAccesses) * 100 
    : 0
    
  const withTilingHitRate = withTiling.memoryAccesses > 0 
    ? (withTiling.cacheHits / withTiling.memoryAccesses) * 100 
    : 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>Eficiencia de Caché con Tiling</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <div className="font-semibold mb-3 text-center">Sin Tiling</div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2 bg-green-50 rounded">
                <div className="text-xs text-gray-500">Aciertos</div>
                <div className="font-bold text-green-600">{withoutTiling.cacheHits}</div>
              </div>
              <div className="p-2 bg-red-50 rounded">
                <div className="text-xs text-gray-500">Fallos</div>
                <div className="font-bold text-red-600">{withoutTiling.cacheMisses}</div>
              </div>
              <div className="p-2 bg-blue-50 rounded">
                <div className="text-xs text-gray-500">Total</div>
                <div className="font-bold text-blue-600">{withoutTiling.memoryAccesses}</div>
              </div>
            </div>
            <div className="mt-2 text-center">
              <div className="text-sm">Tasa de aciertos: {withoutTilingHitRate.toFixed(1)}%</div>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <div className="font-semibold mb-3 text-center">Con Tiling</div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2 bg-green-50 rounded">
                <div className="text-xs text-gray-500">Aciertos</div>
                <div className="font-bold text-green-600">{withTiling.cacheHits}</div>
              </div>
              <div className="p-2 bg-red-50 rounded">
                <div className="text-xs text-gray-500">Fallos</div>
                <div className="font-bold text-red-600">{withTiling.cacheMisses}</div>
              </div>
              <div className="p-2 bg-blue-50 rounded">
                <div className="text-xs text-gray-500">Total</div>
                <div className="font-bold text-blue-600">{withTiling.memoryAccesses}</div>
              </div>
            </div>
            <div className="mt-2 text-center">
              <div className="text-sm">Tasa de aciertos: {withTilingHitRate.toFixed(1)}%</div>
            </div>
          </div>
          
          <div className="p-3 bg-green-50 border border-green-200 rounded">
            <div className="font-semibold text-green-800 text-center">
              Mejora en tasa de aciertos: {(withTilingHitRate - withoutTilingHitRate).toFixed(1)}%
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}