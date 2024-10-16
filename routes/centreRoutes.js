const express = require('express');
const router = express.Router();
const Centre = require('../models/Centre');
const Sport = require('../models/Sport');
const Court = require('../models/Court');

// Get all centres
router.get('/', async (req, res) => {
  try {
    const centres = await Centre.find();
    res.json(centres);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching centres' });
  }
});

// Get sports by centre
router.get('/sports', async (req, res) => {
  try {
    const { centreId } = req.query;
    const sports = await Sport.find();
    res.json(sports);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching sports' });
  }
});

router.get('/courts', async (req, res) => {
    try {
    //   const { centreId } = req.query;
      const courts = await Court.find();
      res.json(courts);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching sports' });
    }
  });
module.exports = router;
