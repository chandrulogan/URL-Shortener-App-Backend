const { MongoClient } = require('mongodb');
const { ObjectId } = require('mongodb');

const { dbName, dbUrl } = require('../dataBase/dbConfig');
const client = new MongoClient(dbUrl);

async function connectToClient() {
    try {
        await client.connect();
        console.log('Connected to the database');
    } catch (error) {
        console.error('Error connecting to the database:', error);
    }
}

const getUrlsByUserId = async (req, res) => {
    const userId = req.params.userId;
    connectToClient();

    try {
        const db = client.db(dbName);
        const userUrls = await db.collection('urls').find({ userId }).toArray();

        if (userUrls.length === 0) {
            return res.status(404).send({
                statusCode: 404,
                message: 'User URLs not found'
            });
        }

        res.send({
            statusCode: 200,
            data: userUrls
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            statusCode: 500,
            message: 'Internal Server Error'
        });
    }
}

const getDataByObject = async (req, res) => {
    const urlId = req.params.urlId;

    connectToClient();

    try {
        const db = client.db(dbName);

        const query = { _id: new ObjectId(urlId) };

        const result = await db.collection('urls').findOne(query);

        if (!result) {
            return res.status(404).send({
                statusCode: 404,
                message: 'Data not found based on the query'
            });
        }

        res.send({
            statusCode: 200,
            data: result
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            statusCode: 500,
            message: 'Internal Server Error'
        });
    }
}

const updateDataById = async (req, res) => {
    const urlId = req.params.urlId;
    const updateData = req.body;

    connectToClient();

    try {
        const db = client.db(dbName);
        const query = { _id: new ObjectId(urlId) };

        const updateOperation = {
            $set: updateData,
        };

        const result = await db.collection('urls').updateOne(query, updateOperation);

        if (result.matchedCount === 0) {
            return res.status(404).send({
                statusCode: 404,
                message: 'Data not found for the provided ID',
            });
        }

        res.send({
            statusCode: 200,
            message: 'Data updated successfully',
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            statusCode: 500,
            message: 'Internal Server Error',
        });
    }
}

const deleteDataById = async (req, res) => {
    const urlId = req.params.urlId;

    connectToClient();

    try {
        const db = client.db(dbName);
        const query = { _id: new ObjectId(urlId) };

        const result = await db.collection('urls').deleteOne(query);

        if (result.deletedCount === 0) {
            return res.status(404).send({
                statusCode: 404,
                message: 'Data not found for the provided ID',
            });
        }

        res.send({
            statusCode: 200,
            message: 'Data deleted successfully',
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            statusCode: 500,
            message: 'Internal Server Error',
        });
    }
}

module.exports = {
    getUrlsByUserId,
    getDataByObject,
    updateDataById,
    deleteDataById,
};
