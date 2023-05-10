const {
    getAllLunches,
    AddNewLunche,
    checkFlightExist,
    AbortMisson
} = require('../../models/lunches.model');
const {setData} = require('../../util/setPagination');

async function httpgetAllLunches(req,res){
    const {skip, limit} = setData(req.query);
    return res.status(200).json(await getAllLunches(skip, limit));
}

async function httpAddNewLunche(req, res){
    const lunch = req.body;

    if(!lunch.lunchDate || !lunch.mission || !lunch.rocket || !lunch.destination){
        return res.status(400).json({
            error: 'Require feild is missing for lunch'
        })
    }
    
    if(isNaN(new Date(lunch.lunchDate))){
        return res.status(400).json({
            error: 'Date is not Valid'
        })
    }
    await AddNewLunche(lunch);
    return res.status(201).json(lunch);   
}

async function httpAbortLunche(req,res){
    const LunchId = Number(req.params.id);
    const getFlightId = await checkFlightExist(LunchId);
    if(!getFlightId){
        return res.status(400).json({
            error : 'flight Id not found!'
        });
    }
    const aborted = AbortMisson(LunchId);
    if(!aborted){
        return res.status(400).json({
            error : 'Lauch can\'t delete !'
        });
    }
    return res.status(200).json({
        ok : true
    });
}

module.exports = {
    httpgetAllLunches,
    httpAddNewLunche,
    httpAbortLunche,
}