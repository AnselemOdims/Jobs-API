const express = require('express');
const { connectDB } = require('./app');
const Job = require('./model/Job');
const mockData = require('./mockData.json');

const populate =  async () => {
    try {
        await connectDB();
        await Job.create(mockData)
        console.log('Data successfully loaded')
    } catch(err) {
        console.log(err)
    }
}

populate();