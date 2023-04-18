const mongoose = require('mongoose');
const moment = require('moment');

const Job = require('../model/Job');
const { StatusCodes } = require('http-status-codes');
const { notFoundError, badRequestError } = require('../utils/CustomError');

const getAllJobs = async (req, res) => {
  const { status, jobType, sort, page, search } = req.query;
  const { id } = req.user;

  let filterObj = {
    createdBy: id,
  };
  if (search) {
    filterObj.position = { $regex: search, $options: 'i' };
  }
  if (status && status !== 'all') {
    filterObj.status = status;
  }
  if (jobType && jobType !== 'all') {
    filterObj.jobType = jobType;
  }

  let result = Job.find(filterObj);

  if (sort === 'latest') result = result.sort('-createdAt');
  if (sort === 'oldest') result = result.sort('createdAt');
  if (sort === 'a-z') result = result.sort('position');
  if (sort === 'z-a') result = result.sort('-position');

  const pages = Number(page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (pages - 1) * limit;

  result = result.skip(skip).limit(limit);

  const jobs = await result;

  const totalJobs = await Job.countDocuments(filterObj);
  const numOfPages = Math.ceil(totalJobs / limit);

  res.status(StatusCodes.OK).json({
    code: '00',
    message: 'All jobs retrieved successfully',
    jobs,
    totalJobs,
    numOfPages,
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
  const { id } = req.user;
  const job = await Job.create({
    ...req.body,
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
    user: { id, testUser },
    params: { id: jobId },
  } = req;
  if (testUser) {
    return res.status(401).send('Can not perform action with test user');
  }
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

const getStatus = async (req, res) => {
  const { id } = req.user;
  const createdBy = {createdBy: new mongoose.Types.ObjectId(id)}
  let stats = await Job.aggregate([
    { $match: createdBy },
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  let monthlyApplications = await Job.aggregate([
    { $match: createdBy },
    {
      $group: {
        _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { '_id.year': -1, '_id.month': -1 },
    },
    { $limit: 6 },
  ]);

  monthlyApplications = monthlyApplications.map(({ _id, count }) => {
    const { year, month } = _id;
    const date = moment()
      .month(month - 1)
      .year(year)
      .format('MMM YYYY');
    return { date, count };
  }).reverse();

  let statsObj = {};

  stats.forEach(({ _id, count }) => {
    statsObj[_id] = count;
  });

  statsObj = {
    pending: statsObj.pending || 0,
    interview: statsObj.interview || 0,
    declined: statsObj.declined || 0,
  };

  res.status(StatusCodes.OK).json({
    code: '00',
    message: 'Status retrieved successfully',
    defaultStats: statsObj,
    monthlyApplications,
  });
};

module.exports = {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
  getStatus,
};
