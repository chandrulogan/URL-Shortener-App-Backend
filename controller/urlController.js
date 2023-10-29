// const Url = require('../schema/urlModels');
const { MongoClient } = require('mongodb');
// const { ObjectId } = require('mongodb');
const UrlShortener = require('../utils/urlShortener');

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

const shortenUrl = async (req, res) => {
    try {
        await connectToClient(); // Add 'await' here
        const { userId, urlName, url } = req.body;
        const db = client.db(dbName);
        const collection = db.collection('urls');
        const existingUrl = await collection.findOne({ url: req.body.url });

        if (existingUrl) {
            // If the email already exists, respond with a 409 Conflict status
            return res.status(409).json({ error: 'This Url is already Shortened' });
        }

        const shortUrl = UrlShortener.generateShortUrl();
        const dataToInsert = {
            userId: userId,
            urlName: urlName,
            url: url,
            shortUrl,
            clicks: 0
        };
        await collection.insertOne(dataToInsert);
        console.log(shortUrl);

        res.status(200).send("Data Inserted Successfully: " + dataToInsert.url);

    } catch (error) {
        console.log(error);
    }
}

const redirectToOriginalUrl = async (req, res) => {
    try {
        await connectToClient();

        const shortUrl = req.params.shortUrl;
        const db = client.db(dbName);
        const collection = db.collection('urls');
        const url = await collection.findOne({ shortUrl: shortUrl });

        if (!url) {
            console.log("URL Not Found");
        } else {
            url.clicks += 1;
            await collection.updateOne({ _id: url._id }, { $inc: { clicks: 1 } });
            res.redirect(url.url);
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
}

module.exports = {
    redirectToOriginalUrl,
    shortenUrl
};
