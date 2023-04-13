const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
    company: {
        type: String,
        required: [true, 'Please kindly include company name'],
        maxlength: 100
    },
    position: {
        type: String,
        required: [true, 'Please provide position'],
        maxlength: 200
    },
    status: {
        type: String,
        enum: ['interview', 'declined', 'pending'],
        default: 'pending'
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, 'Please provide user']
    },
    jobType: {
        type: String,
        enum: ['full-time', 'part-time', 'remote', 'internship'],
        default: 'full-time',
        required: [true, 'Please provide job type']
    },
    jobLocation: {
        type: String,
        maxLength: 200,
    }
}, { timestamps: true})

const Job = mongoose.model('Job', JobSchema)

module.exports = Job;