const express = require('express');
const router = express.Router();
const { 
  createSoftware,
  getAllSoftware,
  getSoftwareById,
  updateSoftware,
  deleteSoftware
} = require('../controllers/softwareController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { isAdmin, isEmployee } = require('../middleware/roleMiddleware');

router.use(authenticateToken);

router.get('/', isEmployee, getAllSoftware);
router.get('/:id', isEmployee, getSoftwareById);


router.post('/', isAdmin, createSoftware);
router.put('/:id', isAdmin, updateSoftware);
router.delete('/:id', isAdmin, deleteSoftware);

module.exports = router;