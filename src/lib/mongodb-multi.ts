import mongoose from 'mongoose'

const SOURCE_URI = process.env.MONGODB_URI as string
const DEST_URI = process.env.MONGODB_URI_OLD as string

if (!SOURCE_URI || !DEST_URI) {
  throw new Error('Please define both MONGODB_URI and MONGODB_URI_OLD environment variables.')
}

// Global caching for both connections
let cached = (global as any).dbMigrationConnections

if (!cached) {
  cached = (global as any).dbMigrationConnections = { source: null, dest: null }
}

export async function connectMigrationDBs() {
  if (!cached.source) {
    cached.source = await mongoose.createConnection(SOURCE_URI, { bufferCommands: false }).asPromise()
    console.log('Connected to Source Database')
  }

  if (!cached.dest) {
    cached.dest = await mongoose.createConnection(DEST_URI, { bufferCommands: false }).asPromise()
    console.log('Connected to Destination Database')
  }

  return {
    sourceConn: cached.source,
    destConn: cached.dest
  }
}