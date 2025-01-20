const mongoose = require('mongoose');

/**
 * General method to query any MongoDB collection dynamically.
 * 
 * @param {String} collectionName - The name of the collection to query.
 * @param {Object} filter - The filter criteria for the query (e.g., `{ empId: 123 }`).
 * @param {Array} pipeline - Optional aggregation pipeline stages (e.g., lookup, project).
 * @returns {Promise} - Returns a promise with the query results.
 */
exports.queryCollection = async (req, res) => {
  try {
    const { collectionName, filter = {}, pipeline = [], options = {} } = req.body;

    // Validate collection name
    if (!collectionName) {
      return res.status(400).send({ error: 'Collection name is required.' });
    }

    // Get the collection dynamically
    const Collection = mongoose.connection.collection(collectionName);

    if (!Collection) {
      return res.status(404).send({ error: 'Collection not found.' });
    }

    // Build the query
    const basePipeline = [];
    if (Object.keys(filter).length > 0) {
      basePipeline.push({ $match: filter }); // Apply filter if present
    }

    // Append additional stages (e.g., $lookup, $project)
    if (pipeline.length > 0) {
      basePipeline.push(...pipeline);
    }

    // Execute the aggregation pipeline
    const results = await Collection.aggregate(basePipeline, options).toArray();

    res.status(200).send(results);
  } catch (error) {
    console.error('Error querying collection:', error);
    res.status(500).send({ error: 'An error occurred while querying the collection.' });
  }
};
