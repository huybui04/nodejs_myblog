const mongoose = require('mongoose');

async function connect() {
    try {
        await mongoose.connect('mongodb://localhost:27017/edu_dev');
        console.log('connect SUCCESSFUL!');
    } catch (error) {
        console.log('connect FAIL!');
    };
}

module.exports = { connect };
