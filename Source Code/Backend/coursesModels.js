var mongoose = require('mongoose');

const coursesModels = mongoose.model("coursesModels",mongoose.Schema ({
    title: {
        type:String,
        trim:true,
        lowercase:true
    } ,
    link : {
        type:String,
        trim:true,
        lowercase:true
    },
    rating : {
        type:String,
        trim:true,
        lowercase:true
    }
})
);

module.exports = coursesModels;
