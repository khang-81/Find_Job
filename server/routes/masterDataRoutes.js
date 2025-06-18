const express = require('express');
const router = express.Router();
const { categories, locations, skills } = require('../controllers/masterDataController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Tất cả các route này chỉ Admin mới có quyền truy cập
router.use(protect, authorize('Admin'));

// Routes cho Categories
router.route('/categories')
    .get(categories.getAll)
    .post(categories.create);
router.route('/categories/:id')
    .put(categories.update)
    .delete(categories.remove);

// Routes cho Locations
router.route('/locations')
    .get(locations.getAll)
    .post(locations.create);
router.route('/locations/:id')
    .put(locations.update)
    .delete(locations.remove);

// Routes cho Skills
router.route('/skills')
    .get(skills.getAll)
    .post(skills.create);
router.route('/skills/:id')
    .put(skills.update)
    .delete(skills.remove);

module.exports = router;