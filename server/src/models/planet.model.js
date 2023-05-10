const planetSchema = require('./planet.mongo');

const {parse} = require('csv-parse');
const fs = require('fs');
const path = require('path');

// const habitablePlanet = [];

function isHabitblePlanet(planet){
    return planet['koi_disposition'] === 'CONFIRMED' 
    && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11
    && planet['koi_prad'] < 1.6; 
}

/*

*/

function loadPlanetData(){
    return new Promise((resolve, reject) => {
        fs.createReadStream(path.join(__dirname,'..','..','data','kepler_data.csv'))
        .pipe(parse({
            comment: '#',
            columns: true,
        })) 
        .on('data',(data)=>{
            if(isHabitblePlanet(data)){
                planetSchema.updateOne({
                    keplerName : data['kepler_name']
                },{
                    keplerName : data['kepler_name']
                },{
                    upsert : true
                })
                // habitablePlanet.push(data);
            }
        })
        .on('error',(err)=>{
            console.log(err);
            reject(err);
        })
        .on('end',()=>{
            console.log('Done!');
            resolve();
        })
    });
}

module.exports = {
    loadPlanetData,
    planets : planetSchema.find({})
}
