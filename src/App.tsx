import './App.css'
import ThemeToggle from './components/common/ThemeToggle'

function App() {

  return (
    <div className="p-10 space-y-8 min-h-screen transition-colors duration-300">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Kassa Web</h1>
        <ThemeToggle />
      </div>
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Solid Buttons</h2>
        <div className="flex flex-wrap gap-4">
          <button className="btn btn-primary">Primary</button>
          <button className="btn btn-secondary">Secondary</button>
          <button className="btn btn-accent">Accent</button>
          <button className="btn btn-info">Info</button>
          <button className="btn btn-success">Success</button>
          <button className="btn btn-warning">Warning</button>
          <button className="btn btn-error">Error</button>
          <button className="btn btn-neutral">Neutral</button>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Outline Buttons</h2>
        <div className="flex flex-wrap gap-4">
          <button className="btn btn-outline btn-primary">Primary</button>
          <button className="btn btn-outline btn-secondary">Secondary</button>
          <button className="btn btn-outline btn-accent">Accent</button>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Sizes</h2>
        <div className="flex flex-wrap items-center gap-4">
          <button className="btn btn-primary btn-lg">Large</button>
          <button className="btn btn-primary btn-md">Normal</button>
          <button className="btn btn-primary btn-sm">Small</button>
          <button className="btn btn-primary btn-xs">Tiny</button>
        </div>
      </div>
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">States</h2>
        <div className="flex flex-wrap items-center gap-4">
          <button className="btn btn-primary">Normal</button>
          <button className="btn btn-primary btn-active">Active</button>
          <button className="btn btn-primary" disabled>Disabled</button>
        </div>
      </div>
    </div>
  )
}

export default App
