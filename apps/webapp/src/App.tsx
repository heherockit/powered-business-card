import { useEffect, useRef, useState } from 'react'
import './App.css'

function AutoResizingTextarea() {
  const [value, setValue] = useState('')
  const ref = useRef<HTMLTextAreaElement | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.height = '0px'
    el.style.height = `${el.scrollHeight}px`
  }, [value])

  return (
    <textarea
      id="card-input"
      ref={ref}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder="Describe the information for your business card..."
      className="input"
      rows={1}
    />
  )
}

function App() {
  return (
    <div className="container">
      <header className="header">
        <h1 className="title">Powered Business Card</h1>
        <p className="subtitle">Minimalist • Modern • Flat</p>
      </header>
      <main className="main">
        <label className="label" htmlFor="card-input">
          Enter a description of what to show on the business card
        </label>
        <AutoResizingTextarea />
      </main>
    </div>
  )
}

export default App
