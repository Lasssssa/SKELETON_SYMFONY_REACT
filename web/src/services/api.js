const API_BASE_URL = '/api'

/**
 * Generic API call function
 */
async function apiCall(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  }

  try {
    const response = await fetch(url, config)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('API call failed:', error)
    throw error
  }
}

/**
 * Health check endpoint
 */
export async function healthCheck() {
  return apiCall('/health')
}

/**
 * Example: Get all users
 */
export async function getUsers() {
  return apiCall('/users')
}

/**
 * Example: Create a new user
 */
export async function createUser(userData) {
  return apiCall('/users', {
    method: 'POST',
    body: JSON.stringify(userData),
  })
}
