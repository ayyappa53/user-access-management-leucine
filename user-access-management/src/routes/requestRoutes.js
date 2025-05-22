const express = require('express');
const router = express.Router();
const { 
  createRequest,
  getAllRequests,
  getPendingRequests,
  getRequestById,
  updateRequestStatus
} = require('../controllers/requestController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { isEmployee, isManager } = require('../middleware/roleMiddleware');

router.use(authenticateToken);
router.get('/', isEmployee, getAllRequests);
router.get('/:id', isEmployee, getRequestById);
router.post('/', isEmployee, createRequest);


router.get('/status/pending', isManager, getPendingRequests);
router.patch('/:id/status', isManager, updateRequestStatus);

module.exports = router;