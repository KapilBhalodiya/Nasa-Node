
function setData(req){
    const limit = req.limit;
    const page = req.page;
    const skip = (page -1) * limit;

    return{
        skip,
        limit
    }
}

module.exports = {setData}