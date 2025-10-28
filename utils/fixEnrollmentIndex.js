const fixEnrollmentIndex = async (mongoose) => {
  try {
    const db = mongoose.connection.db;
    const collection = db.collection('users');

    const indexes = await collection.indexes();
    const hasEnrollmentIndex = indexes.some(index => index.name === 'enrollmentNo_1');

    if (hasEnrollmentIndex) {
      console.log('Dropping existing enrollmentNo index...');
      await collection.dropIndex('enrollmentNo_1');
    }

    console.log('Creating sparse unique index on enrollmentNo...');
    await collection.createIndex({ enrollmentNo: 1 }, { unique: true, sparse: true });

    console.log('✅ enrollmentNo index fixed.');
  } catch (err) {
    console.error('❌ Error fixing enrollment index:', err.message);
  }
};

module.exports = fixEnrollmentIndex;
