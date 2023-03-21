const getAllJobs = () => {
    res.send('All jobs')
}

const getJob = () => {
    res.send('Get a single job')
}

const createJob = (req, res) => {
    res.json(req.user)
}

const updateJob = () => {
    res.send('Update Job')
}

const deleteJob = () => {
    res.send('Delete Job')
}

module.exports = {
    getAllJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob
}