import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface DRAMCellProps {
  active: boolean
  row: number
  column: number
  highlighted?: boolean
  onClick?: () => void
}

export function DRAMCell({ active, row, column, highlighted, onClick }: DRAMCellProps) {
  return (
    <div
      className={`
        w-8 h-8 border flex items-center justify-center text-xs cursor-pointer transition-all duration-200
        ${highlighted ? "ring-2 ring-blue-500" : ""}
        ${active ? "bg-green-500 text-white" : "bg-gray-100"}
      `}
      onClick={onClick}
    >
      {row},{column}
    </div>
  )
}

interface DRAMBankProps {
  id: number
  rows: number
  columns: number
  activeCells: { row: number; column: number }[]
  highlightedCell?: { row: number; column: number } | null
  onCellClick?: (row: number, column: number) => void
}

export function DRAMBank({ 
  id, 
  rows, 
  columns, 
  activeCells, 
  highlightedCell,
  onCellClick
}: DRAMBankProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Banco {id}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
          {Array.from({ length: rows }).map((_, row) => 
            Array.from({ length: columns }).map((_, column) => {
              const isActive = activeCells.some(cell => cell.row === row && cell.column === column)
              const isHighlighted = highlightedCell?.row === row && highlightedCell?.column === column
              
              return (
                <DRAMCell
                  key={`${row}-${column}`}
                  active={isActive}
                  row={row}
                  column={column}
                  highlighted={isHighlighted}
                  onClick={() => onCellClick?.(row, column)}
                />
              )
            })
          )}
        </div>
      </CardContent>
    </Card>
  )
}

interface DRAMVisualizationProps {
  banks: {
    id: number
    rows: number
    columns: number
    activeCells: { row: number; column: number }[]
    highlightedCell?: { row: number; column: number } | null
  }[]
  onCellClick?: (bankId: number, row: number, column: number) => void
}

export function DRAMVisualization({ banks, onCellClick }: DRAMVisualizationProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {banks.map(bank => (
        <DRAMBank
          key={bank.id}
          id={bank.id}
          rows={bank.rows}
          columns={bank.columns}
          activeCells={bank.activeCells}
          highlightedCell={bank.highlightedCell}
          onCellClick={(row, column) => onCellClick?.(bank.id, row, column)}
        />
      ))}
    </div>
  )
}