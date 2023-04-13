const express = require('express');
const {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
} = require('../controllers/job');
const testUser = require('../middleware/testUser');

const router = express.Router();

router.route('/').get(getAllJobs).post(testUser, createJob)
router.route('/:id').get(getJob).patch(testUser, updateJob).delete(testUser, deleteJob)

module.exports = router;
