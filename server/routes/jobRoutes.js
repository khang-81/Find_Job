const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, authorize('Employer'), jobController.createJob)
    .get(jobController.getJobs);

router.get('/my-jobs', protect, authorize('Employer'), jobController.getMyPostedJobs);

router.route('/:id')
    .get(jobController.getJobById)
    .put(protect, authorize('Employer'), jobController.updateJob)
    .delete(protect, authorize('Employer'), jobController.deleteJob);
    
router.post('/:id/apply', protect, authorize('Student'), jobController.applyForJob);
router.get('/:id/applicants', protect, authorize('Employer'), jobController.getJobApplicants);

module.exports = router;