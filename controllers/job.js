const Job = require('../model/Job');
const { StatusCodes } = require('http-status-codes');

const getAllJobs = async (req, res) => {
  const { id } = req.user;
  const jobs = await Job.find({ createdBy: id });
  res
    .status(StatusCodes.OK)
    .json({
      code: '00',
      message: 'All jobs retrieved successfully',
      data: jobs,
      length: jobs.length,
    });
};

const getJob = () => {
  res.send('Get a single job');
};

const createJob = async (req, res) => {
  const { company, position } = req.body;
  const { id } = req.user;
  const job = await Job.create({
    company,
    position,
    createdBy: id,
  });
  res.status(StatusCodes.CREATED).json({
    code: '00',
    message: 'Job created successfully',
    data: job,
  });
};

const updateJob = () => {
  res.send('Update Job');
};

const deleteJob = () => {
  res.send('Delete Job');
};

module.exports = {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
};
