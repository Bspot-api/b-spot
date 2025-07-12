import { useQuery } from '@tanstack/react-query'
import './App.css'
import { apiClient } from './lib/api-client'

// Simple API call function
const fetchHealth = async () => {
  const response = await apiClient.get('/health')
  return response.data
}

function App() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['health'],
    queryFn: fetchHealth,
  })

  return (
    <div className="App">
      <h1>Boycotteur</h1>
      
      <div className="card">
        <h2>API Status</h2>
        
        {isLoading && <p>Loading...</p>}
        
        {error && (
          <div style={{ color: 'red' }}>
            <p>Error: {error.message}</p>
          </div>
        )}
        
        {data && (
          <div style={{ color: 'green' }}>
            <p>Status: {data.status}</p>
            <p>Uptime: {data.uptime.toFixed(2)}s</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
