const express = require('express');
const { getAllResources, createResource, getResourceById, updateResource, deleteResource } = require('../controllers/resourceController');
const router = express.Router();

// Get all resources
router.get('/', getAllResources);

// Create a new resource
router.post('/', createResource);

// Get a single resource by ID
router.get('/:id', getResourceById);

// Update a resource by ID
router.put('/:id', updateResource);

// Delete a resource by ID
router.delete('/:id', deleteResource);

module.exports = router;