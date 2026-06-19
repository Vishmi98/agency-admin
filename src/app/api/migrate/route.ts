import { NextResponse } from 'next/server'

import { connectMigrationDBs } from '@/lib/mongodb-multi'


export async function POST() {
    try {
        const { sourceConn, destConn } = await connectMigrationDBs()

        // 1. Get all collection names directly from the source DB
        const collections = await sourceConn.db.listCollections().toArray()
        const migrationSummary: Record<string, number> = {}

        // 2. Loop through every collection dynamically
        for (const collectionInfo of collections) {
            const collectionName = collectionInfo.name

            // Skip system collections if any exist
            if (collectionName.startsWith('system.')) continue

            const sourceCollection = sourceConn.db.collection(collectionName)
            const destCollection = destConn.db.collection(collectionName)

            // 3. Clear existing data in the destination collection to prevent duplicates
            await destCollection.deleteMany({})

            // 4. Batch-read and write data to optimize memory footprint
            const batchSize = 500
            let skip = 0
            let totalCopied = 0

            while (true) {
                const documents = await sourceCollection
                    .find({})
                    .skip(skip)
                    .limit(batchSize)
                    .toArray()

                if (documents.length === 0) break

                // Insert documents into the destination collection
                await destCollection.insertMany(documents)

                totalCopied += documents.length
                skip += batchSize
            }

            migrationSummary[collectionName] = totalCopied
            console.log(`Successfully migrated ${totalCopied} documents from standard collection: ${collectionName}`)
        }

        return NextResponse.json({
            success: true,
            message: 'Database migration completed successfully!',
            details: migrationSummary
        }, { status: 200 })

    } catch (error: any) {
        console.error('Migration failed:', error)
        return NextResponse.json({
            success: false,
            error: error.message || 'An error occurred during database migration'
        }, { status: 500 })
    }
}