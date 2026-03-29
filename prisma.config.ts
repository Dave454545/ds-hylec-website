import 'dotenv/config'
import { defineConfig, env } from '@prisma/config'

export default defineConfig({
  schema: './prisma/schema.prisma',
  
  // CLI utilise DIRECT_URL pour migrations (port 5432)
  datasource: {
    url: env('DIRECT_URL'),
  },
  
  // Logs pour debug
  log: ['query', 'info', 'warn', 'error'],
})
