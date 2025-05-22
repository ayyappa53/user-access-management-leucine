const AppDataSource = require('../config/database');
const User = require('../entities/User');
const Request = require('../entities/Request');

const getRepositories = async () => {
  return {
    requestRepository: AppDataSource.getRepository(Request),
    userRepository: AppDataSource.getRepository(User),
    softwareRepository: AppDataSource.getRepository('Software')
  };
};

const createRequest = async (req, res) => {
  try {
    const { softwareId, accessType, reason } = req.body;
    const userId = req.user.id;
    if (!softwareId || !accessType || !reason) {
      return res.status(400).json({
        message: 'Software ID, access type, and reason are required'
      });
    }
    const validAccessTypes = ['Read', 'Write', 'Admin'];
    if (!validAccessTypes.includes(accessType)) {
      return res.status(400).json({
        message: 'Access type must be: Read, Write, or Admin'
      });
    }
    const { requestRepository, userRepository, softwareRepository } = await getRepositories();
    const user = await userRepository.findOne({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const software = await softwareRepository.findOne({ where: { id: parseInt(softwareId) } });
    if (!software) {
      return res.status(404).json({ message: 'Software not found' });
    }
    if (!software.accessLevels.includes(accessType)) {
      return res.status(400).json({
        message: `The software does not support '${accessType}' access level`
      });
    }
    const existingRequest = await requestRepository.findOne({
      where: {
        user: { id: userId },
        software: { id: parseInt(softwareId) },
        status: 'Pending'
      }
    });
    if (existingRequest) {
      return res.status(409).json({
        message: 'You already have a pending request for this software'
      });
    }
    const newRequest = await requestRepository.save({
      user: { id: userId },
      software: { id: parseInt(softwareId) },
      accessType,
      reason,
      status: 'Pending'
    });
    res.status(201).json({
      message: 'Access request submitted successfully',
      request: newRequest
    });
  } catch (error) {
    console.error('Create request error:', error);
    res.status(500).json({ message: 'Error submitting access request' });
  }
};

const getAllRequests = async (req, res) => {
  try {
    const { requestRepository } = await getRepositories();
    const { role, id } = req.user;
    let requests;
    if (role === 'Employee') {
      requests = await requestRepository.find({
        where: { user: { id } },
        order: { createdAt: 'DESC' }
      });
    } else {
      requests = await requestRepository.find({
        order: { createdAt: 'DESC' }
      });
    }
    res.json({ requests });
  } catch (error) {
    console.error('Get all requests error:', error);
    res.status(500).json({ message: 'Error retrieving access requests' });
  }
};

const getPendingRequests = async (req, res) => {
  try {
    const { requestRepository } = await getRepositories();
    const pendingRequests = await requestRepository.find({
      where: { status: 'Pending' },
      order: { createdAt: 'ASC' }
    });
    res.json({ requests: pendingRequests });
  } catch (error) {
    console.error('Get pending requests error:', error);
    res.status(500).json({ message: 'Error retrieving pending requests' });
  }
};

const getRequestById = async (req, res) => {
  try {
    const { id } = req.params;
    const { role, id: userId } = req.user;
    const { requestRepository } = await getRepositories();
    const request = await requestRepository.findOne({ where: { id: parseInt(id) } });
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    if (role === 'Employee' && request.user.id !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }
    res.json({ request });
  } catch (error) {
    console.error('Get request by ID error:', error);
    res.status(500).json({ message: 'Error retrieving request' });
  }
};

const updateRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, comments } = req.body;
    const validStatuses = ['Approved', 'Rejected'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        message: 'Valid status (Approved or Rejected) is required'
      });
    }
    const { requestRepository } = await getRepositories();
    const request = await requestRepository.findOne({ where: { id: parseInt(id) } });
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    if (request.status !== 'Pending') {
      return res.status(400).json({
        message: `Cannot update request that is already ${request.status.toLowerCase()}`
      });
    }
    request.status = status;
    if (comments) {
      request.comments = comments;
    }
    request.updatedAt = new Date();
    request.processedBy = req.user.id;
    const updatedRequest = await requestRepository.save(request);
    res.json({
      message: `Request ${status.toLowerCase()} successfully`,
      request: updatedRequest
    });
  } catch (error) {
    console.error('Update request status error:', error);
    res.status(500).json({ message: 'Error updating request status' });
  }
};

module.exports = {
  createRequest,
  getAllRequests,
  getPendingRequests,
  getRequestById,
  updateRequestStatus
};