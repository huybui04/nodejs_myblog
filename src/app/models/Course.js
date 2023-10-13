const mongoose = require('mongoose');

const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');


const Schema = mongoose.Schema;

const Course = new Schema({
    name: { type: String },
    description : { type: String },
    docLink: { type: String },
    img : { type: String },
    videoId : { type: String },
    level : { type: String },
    slug: { type: String, slug: 'name'},
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
}, {
    timestamps : true,
});

// Text Index
Course.index( { "name": "text" } )

// Add plugin
mongoose.plugin(slug);
Course.plugin(mongooseDelete, { 
    overrideMethods: 'all', 
    deletedAt: true,
});

module.exports = mongoose.model('Course', Course);
