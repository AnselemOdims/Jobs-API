const Job = require('../model/Job');
const { StatusCodes } = require('http-status-codes');
const { notFoundError, badRequestError } = require('../utils/CustomError');

const getAllJobs = async (req, res) => {
  const { id } = req.user;
  const jobs = await Job.find({ createdBy: id });
  res.status(StatusCodes.OK).json({
    code: '00',
    message: 'All jobs retrieved successfully',
    data: jobs,
    length: jobs.length,
  });
};

const getJob = async (req, res) => {
  const { id } = req.user;
  const { id: jobId } = req.params;
  const job = await Job.findOne({
    _id: jobId,
    createdBy: id,
  });
  if (!job) {
    throw notFoundError(`No job with id ${jobId}`);
  }
  res.status(StatusCodes.OK).json({
    code: '00',
    message: 'Job retrieved successfully',
    data: job,
  });
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

const updateJob = async (req, res) => {
  const {
    body: { company, position },
    user: { id },
    params: { id: jobId },
  } = req;
  if (!company || !position) {
    throw badRequestError('Company and Position can not be empty');
  }
  const job = await Job.findByIdAndUpdate(
    { _id: jobId, createdBy: id },
    req.body,
    { new: true, runValidators: true }
  );
  res.status(StatusCodes.OK).json({
    code: '00',
    message: 'Job updated successfully!',
    data: job,
  });
};

const deleteJob = async (req, res) => {
  const {
    params: { id: jobId },
    user: { id },
  } = req;
  const job = await Job.findByIdAndDelete({ _id: jobId, createdBy: id });
  if (!job) {
    throw notFoundError(`No job with id ${jobId}`);
  }
  res.status(StatusCodes.OK).json({
    code: '00',
    message: 'Job removed successfully',
  });
};

module.exports = {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
};
