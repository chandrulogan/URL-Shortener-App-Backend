const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const saltRound = 10
const secretKey = 'sdnfkKLJSAA3NK;BF,nkjfi5jlebjf!$%#%@sdnlkbj'

let hashPassword = async (password)=>{
    let salt = await bcrypt.genSalt(saltRound)
    let hashedPassword = await bcrypt.hash(password,salt)
    return hashedPassword
}

let hashCompare = async(password, hashedPassword) =>{
    return bcrypt.compare(password, hashedPassword)
}

let createToken = (email, name)=>{
    let token = jwt.sign(
        { email, name }, 
        secretKey, 
        { expiresIn: '1h' }
    )
    // console.log(token);
    return token
}

let validate = async (token)=>{
    let data = await jwt.decode(token)
    console.log(data);
}

module.exports = {
    hashPassword, 
    hashCompare,
    createToken,
    validate
}