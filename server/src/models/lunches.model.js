const axios = require('axios');
const launchesSchema = require('./lauches.mongo');

const DEFAUL_FLIGHT_NUMBER = 100;

const SPACEX_API = "https://api.spacexdata.com/v4/launches/query";

const launch = {
    flightNumber : 100, //flight_number
    lunchDate : new Date('Dec 27, 2032'), //date_local
    mission : "Mangal", //name
    rocket : "Kepler-B-100", //rocket.name
    destination : "Keplers", // not set/applicable in SPACX_API
    customer : ["AtoZ","ZtoM"], //payloads.customers for each payload
    success: true, //success
    upcoming: true //upcoming
}

saveLauch(launch);

async function getloadDragon(){
    const res = await axios.get("https://api.spacexdata.com/v4/dragons");
    console.log(res.data);   
}

async function loadSpaceXData(){
    const first = await findlauch({
        flightNumber : 1,
        rocket : 'Falcon 1',
        mission : 'FalconSat'
    })
    if(first){
        console.log("Already loaded!");
        return;
    }
    console.log("Downloading......");
    const response = await axios.post(SPACEX_API, {
        query:{},
        options:{
            pagination:false,
            populate:[
                {
                    path:"rocket",
                    select:{
                        name:1
                    }
                },
                {
                    path:"payloads",
                    select:{
                        'customers' : 1
                    }
                }
            ]
        }
    });

    const launchDocs = response.data.docs;
    for(const launchDoc of launchDocs){
        const payloads = launchDoc['payloads'];
        const customer = payloads.flatMap((payload_arr)=>{
            return payload_arr['customers']
        });

        const lauch = {
            flightNumber : launchDoc['flight_number'],
            lunchDate : launchDoc['date_local'],
            mission : launchDoc['name'],
            rocket : launchDoc['rocket']['name'],
            success : launchDoc['success'],
            upcoming : launchDoc['upcoming'],
            customer
        };
        await saveLauch(lauch);
        console.log(`${lauch.flightNumber} ${lauch.mission}`);
    }    
}

async function getLatestFlight(){
    const latestflightNumber = await launchesSchema
    .findOne()
    .sort('-flightNumber');
    
    if(!latestflightNumber){
        return DEFAUL_FLIGHT_NUMBER;
    }

    return latestflightNumber.flightNumber;
} 

async function saveLauch(launch){
    await launchesSchema.findOneAndUpdate({
        flightNumber : launch.flightNumber,
    }, launch, {
        upsert : true
    })
}

async function AddNewLunche(newLunche){
    const lauch = Object.assign(newLunche,{
        customer: ['AtoZ','ZtoM'],
        success: true,
        upcoming:true,
        flightNumber : await getLatestFlight() + 1,
    });

    await saveLauch(lauch);
}

async function getAllLunches(skip, limit){
    return await launchesSchema
    .find({},{'_id': 0, '__v' : 0})
    .sort({flightNumber : 1})
    .skip(skip)
    .limit(limit);
}

async function findlauch(filter){
    return await launchesSchema.findOne(filter);
} 

async function checkFlightExist(flightId){
    return await findlauch({
        flightNumber : flightId
    });
}

async function AbortMisson(flightId){
    const aborted = await launchesSchema.updateOne({
        flightNumber : flightId
    },{
        upcoming : false,
        success : false
    })
    return aborted.ok === 1 && aborted.nModified === 1;
}

module.exports = {
    getloadDragon,
    loadSpaceXData,
    getAllLunches,
    AddNewLunche,
    checkFlightExist,
    AbortMisson
};