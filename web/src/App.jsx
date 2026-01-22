import { useState, useEffect } from 'react'
import './App.css'
import { healthCheck } from './services/api'

function App() {
  const [health, setHealth] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const data = await healthCheck()
        setHealth(data)
        setError(null)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    checkHealth()
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <h1>🚀 Symfony + React App</h1>
        
        <div className="card">
          <h2>API Health Check</h2>
          
          {loading && <p>Loading...</p>}
          
          {error && (
            <div className="error">
              <p>❌ Error: {error}</p>
            </div>
          )}
          
          {health && (
            <div className="success">
              <p>✅ Status: {health.status}</p>
              <p>📝 Message: {health.message}</p>
              <p>🕐 Timestamp: {health.timestamp}</p>
            </div>
          )}
        </div>

        <p className="info">
          Backend API is running on <code>/api</code>
        </p>
      </header>
    </div>
  )
}

export default App
