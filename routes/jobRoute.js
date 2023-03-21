const express = require('express');
const { homeController } = require('../controllers/home');
const {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
} = require('../controllers/job');

const router = express.Router();

router.route('/').get(homeController);
router.route('/').get(getAllJobs).post(createJob)
router.route('/:id').get(getJob).patch(updateJob).delete(deleteJob)

module.exports = router;
