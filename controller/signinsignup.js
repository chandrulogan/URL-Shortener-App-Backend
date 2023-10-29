const { MongoClient } = require('mongodb');
const nodemailer = require('nodemailer');
const { hashPassword, hashCompare, createToken, validate } = require('../utils/auth')
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

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'chandrufsdtesting@gmail.com',
        pass: 'owwqomsbknsqowye',
    },
});

const signup = async (req, res) => {
    try {
        await connectToClient();
        const { name, email, phoneNo, password, confirmPassword } = req.body;
        const db = client.db(dbName);
        const collection = db.collection('userData');
        const dbemail = await collection.findOne({ email: req.body.email });

        if (dbemail) {
            return res.status(409).json({ error: 'This Email is already registered' });
        }

        const hashedPassword = await hashPassword(password);

        const dataToInsert = {
            name: name,
            email: email,
            phoneNo: phoneNo,
            password: hashedPassword,
            confirmPassword: confirmPassword,
        };

        await collection.insertOne(dataToInsert);

        const dataforResponse = {
            name: name,
            email: email,
            phoneNo: phoneNo,
        };

        // Create a token for the newly registered user
        const token = createToken(email, name);

        res.status(200).json({
            message: 'Registration successful',
            user: dataforResponse,
            token: token,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const signin = async (req, res) => {
    try {
        await connectToClient();
        const { email, password } = req.body;
        const db = client.db(dbName);
        const collection = db.collection('userData');

        const user = await collection.findOne({ email: email });

        if (!user) {
            return res.status(401).json({ error: 'Invalid Login' });
        }

        const isPasswordValid = await hashCompare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid Login' });
        }

        const userDataToSend = {
            _id: user._id,
            name: user.name,
            email: user.email,
        };

        let token = createToken(email, userDataToSend.name)
        // console.log(token);

        // If the email and password are valid, you can consider the user as authenticated
        res.status(200).json({
            message: 'Login successful',
            user: userDataToSend,
            token
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const resetPassword = async (req, res) => {
    try {
        const { email } = req.body;

        await connectToClient();

        const db = client.db(dbName);
        const collection = db.collection('userData');
        const existingEmployee = await collection.findOne({ email: req.body.email });

        if (!existingEmployee) {
            // If the email already exists, respond with a 409 Conflict status
            return res.status(409).json({ error: 'Not a Register User' });
        } else {
            const verificationOTP = Math.floor(100000 + Math.random() * 900000).toString();

            const mailOptions = {
                from: 'chandrufsdtesting@gmail.com',
                to: email,
                subject: 'Email Verification OTP',
                text: `Your verification OTP: ${verificationOTP}`,
            };

            // await collection.updateOne({ verificationOTP: verificationOTP }); // this is invalid line or step
            await collection.updateOne({ email: req.body.email }, { $set: { verificationOTP: verificationOTP } }); //will update the userOTP in the db so that we can verify it in the verify function
            console.log("otp send");
            res.send({
                email: email
            })

            return await transporter.sendMail(mailOptions);
        }

    } catch (error) {
        console.log(error);
    }
}

const verifyOtp = async (req, res) => {
    try {
        const { email, verificationOTP } = req.body;
        await connectToClient();

        const db = client.db(dbName);
        const collection = db.collection('userData');
        const user = await collection.findOne({ email });

        if (user) {
            if (verificationOTP === verificationOTP) {
                await collection.updateOne({ email: req.body.email }, { $set: { isVerified: true } });
                return res.status(200).json({ Response: 'User Verified' });
            } else {
                return res.status(401).json({ Response: 'Invalid OTP' });
            }
        } else {
            return res.status(401).json({ Response: 'Invalid Email' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ Response: 'Internal Server Error' });
    }
}

const updatePassword = async (req, res) => {
    try {
        const { email, password, confirmPassword } = req.body;
        await connectToClient();

        const db = client.db(dbName);
        const collection = db.collection('userData');
        const user = await collection.findOne({ email });

        if (user) {
            if (user.isVerified === true) {
                await collection.updateOne({ email }, { $set: { password: req.body.password, confirmPassword: req.body.confirmPassword, isVerified: false } });
                return res.status(200).json({ Response: 'Password Changed Successfully' });
            } else {
                return res.status(401).json({ Response: 'Otp Verification Required' });
            }
        } else {
            return res.status(401).json({ Response: 'User Not Available' });
        }
    } catch (error) {
        console.log(error);
    }
}


module.exports = {
    signup,
    signin,
    resetPassword,
    verifyOtp,
    updatePassword
};