import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'

// Get the parent directory 
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const parentDir = path.resolve(__dirname, '..')

const app = express()
const port = 3000 // You can choose any port you prefer

// Serve static files from the root directory
app.use(express.static(parentDir))

app.listen(port, () => {
  console.info(`Server is running on http://localhost:${port}`)
})