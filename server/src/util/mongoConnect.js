const mongoose = require('mongoose');

const MONGO_URL = "mongodb+srv://admin:dg6mduWYntNbf93v@cluster0.kaxaqkp.mongodb.net/NasaProject" || process.env.MONGO_URL;

mongoose.connection.once('open',() => {
    console.log("Connected!");
})
mongoose.connection.on('error',(err) => {
    console.log("Not Connected! "+err);
})

async function mongoConeection(){
    await mongoose.connect(MONGO_URL);
}

async function mongoDisconnect(){
    await mongoose.disconnect();
}

module.exports = {
    mongoConeection,
    mongoDisconnect
}