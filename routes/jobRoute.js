const express = require('express');
const {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
  getStatus
} = require('../controllers/job');
const testUser = require('../middleware/testUser');

const router = express.Router();

router.route('/').get(getAllJobs).post(testUser, createJob)
router.route('/stats').get(getStatus)
router.route('/:id').get(getJob).patch(testUser, updateJob).delete(testUser, deleteJob)

module.exports = router;
