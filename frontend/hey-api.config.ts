export default {
  input: 'http://localhost:3000/api-json',
  output: 'src/api/hooks',
  plugins: [
    '@tanstack/react-query',
  ],
  // Try to set the baseUrl in the client configuration
  client: {
    baseUrl: 'http://localhost:3000'
  }
}; 