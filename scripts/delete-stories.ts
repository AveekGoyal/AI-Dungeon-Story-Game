const { MongoClient } = require('mongodb');

async function deleteAllStories() {
  try {
    console.log('Connecting to MongoDB...');
    const client = await MongoClient.connect('mongodb://localhost:27017/ai-dungeon');
    const db = client.db();

    console.log('Deleting all stories...');
    const result = await db.collection('stories').deleteMany({});

    console.log(`Successfully deleted ${result.deletedCount} stories`);
    await client.close();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

deleteAllStories();
