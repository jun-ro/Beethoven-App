const path = require('node:path')

class Hermes{
    constructor(prefix, express_obj){
        this.prefix = prefix
        this.express_obj = express_obj
    }
    ServeFolder(endpoint, folder){
        this.express_obj.get(`/${this.prefix}/${endpoint}/:id`, async(req, res) =>{
            var fileReq = req.params.id
            res.sendFile(path.join(folder, fileReq))
        })
    }  
}

module.exports = Hermes