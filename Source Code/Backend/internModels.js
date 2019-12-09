var mongoose = require('mongoose');

const internModels = mongoose.model("internModels",mongoose.Schema ({
    title: {
        type:String,
        trim:true,
        lowercase:true
    },
    link : {
       type: String,
       trim:true,
       lowercase:true
    }
})
);

module.exports = internModels;
