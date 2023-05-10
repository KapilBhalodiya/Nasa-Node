require('dotenv').config();
const http = require('http');
const app = require('./app');
const PORT = process.env.PORT || 8000;

const {mongoConeection} = require('./util/mongoConnect');
const {loadPlanetData} = require('./models/planet.model');
const {loadSpaceXData,getloadDragon} = require('./models/lunches.model');

const server = http.createServer(app);

async function load(){
    await mongoConeection();
    await loadPlanetData();
    await loadSpaceXData();
    server.listen(PORT, () => {
        console.log(`Server is running on ${PORT}`)
    })
} 
load();



