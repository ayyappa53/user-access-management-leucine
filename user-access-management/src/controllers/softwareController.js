const AppDataSource = require('../config/database');
const User = require('../entities/User');
const Software = require('../entities/Software');
const Request = require('../entities/Request');

const getSoftwareRepository = async () => {
  return AppDataSource.getRepository(Software);
};

const createSoftware = async (req, res) => {
  try {
    const { name, description, accessLevels } = req.body;
    if (!name || !description || !accessLevels || !Array.isArray(accessLevels)) {
      return res.status(400).json({ 
        message: 'Name, description, and accessLevels array are required' 
      });
    }
    const validAccessLevels = ['Read', 'Write', 'Admin'];
    const areAccessLevelsValid = accessLevels.every(level => 
      validAccessLevels.includes(level)
    );
    if (!areAccessLevelsValid) {
      return res.status(400).json({ 
        message: 'Access levels must be: Read, Write, or Admin' 
      });
    }
    const softwareRepository = await getSoftwareRepository();
    const existingSoftware = await softwareRepository.findOne({ where: { name } });
    if (existingSoftware) {
      return res.status(409).json({ message: 'Software with this name already exists' });
    }
    const newSoftware = await softwareRepository.save({
      name,
      description,
      accessLevels
    });
    res.status(201).json({
      message: 'Software created successfully',
      software: newSoftware
    });
  } catch (error) {
    console.error('Create software error:', error);
    res.status(500).json({ message: 'Error creating software' });
  }
};

const getAllSoftware = async (req, res) => {
  try {
    const softwareRepository = await getSoftwareRepository();
    const software = await softwareRepository.find();
    res.json({ software });
  } catch (error) {
    console.error('Get all software error:', error);
    res.status(500).json({ message: 'Error retrieving software list' });
  }
};

const getSoftwareById = async (req, res) => {
  try {
    const { id } = req.params;
    const softwareRepository = await getSoftwareRepository();
    const software = await softwareRepository.findOne({ where: { id: parseInt(id) } });
    if (!software) {
      return res.status(404).json({ message: 'Software not found' });
    }
    res.json({ software });
  } catch (error) {
    console.error('Get software by ID error:', error);
    res.status(500).json({ message: 'Error retrieving software' });
  }
};

const updateSoftware = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, accessLevels } = req.body;
    const softwareRepository = await getSoftwareRepository();
    const software = await softwareRepository.findOne({ where: { id: parseInt(id) } });
    if (!software) {
      return res.status(404).json({ message: 'Software not found' });
    }
    if (name) software.name = name;
    if (description) software.description = description;
    if (accessLevels && Array.isArray(accessLevels)) {
      const validAccessLevels = ['Read', 'Write', 'Admin'];
      const areAccessLevelsValid = accessLevels.every(level => 
        validAccessLevels.includes(level)
      );
      if (!areAccessLevelsValid) {
        return res.status(400).json({ 
          message: 'Access levels must be: Read, Write, or Admin' 
        });
      }
      software.accessLevels = accessLevels;
    }
    const updatedSoftware = await softwareRepository.save(software);
    res.json({
      message: 'Software updated successfully',
      software: updatedSoftware
    });
  } catch (error) {
    console.error('Update software error:', error);
    res.status(500).json({ message: 'Error updating software' });
  }
};

const deleteSoftware = async (req, res) => {
  try {
    const { id } = req.params;
    const softwareRepository = await getSoftwareRepository();
    const requestRepository = AppDataSource.getRepository('Request');
    const software = await softwareRepository.findOne({ where: { id: parseInt(id) } });
    if (!software) {
      return res.status(404).json({ message: 'Software not found' });
    }
    await requestRepository.delete({ software: { id: software.id } });
    await softwareRepository.remove(software);
    res.json({ message: 'Software deleted successfully' });
  } catch (error) {
    console.error('Delete software error:', error);
    res.status(500).json({ message: 'Error deleting software: ' + error.message });
  }
};

module.exports = {
  createSoftware,
  getAllSoftware,
  getSoftwareById,
  updateSoftware,
  deleteSoftware
};