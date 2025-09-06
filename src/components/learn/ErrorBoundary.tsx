import React from "react"

type Props = { children: React.ReactNode; fallback?: React.ReactNode }

type State = { hasError: boolean; error?: unknown }

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: unknown): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: unknown, info: unknown) {
    console.error("Visualization error:", error, info)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div className="p-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded">
          Ha ocurrido un error en la visualización. Revisa los parámetros o vuelve a cargar la página.
        </div>
      )
    }
    return this.props.children
  }
}
