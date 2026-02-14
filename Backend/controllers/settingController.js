const Setting = require('../models/Setting');

// @desc    Get all settings
// @route   GET /api/settings
// @access  Admin
exports.getSettings = async (req, res) => {
  console.log('--- getSettings Controller Called ---');
  try {
    let settings = await Setting.findOne();

    // If no settings exist, create a default one
    if (!settings) {
      settings = await Setting.create({});
    }

    res.status(200).json({ success: true, data: settings });
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update settings
// @route   PUT /api/settings
// @access  Admin
exports.updateSettings = async (req, res) => {
  console.log('--- updateSettings Controller Called ---');
  try {
    let settings = await Setting.findOne();

    if (!settings) {
      // If no settings exist, create one before updating
      settings = await Setting.create(req.body);
    } else {
      // Iterate over req.body and update fields
      for (const section in req.body) {
        if (settings[section] && typeof settings[section] === 'object') {
          for (const key in req.body[section]) {
            settings[section][key] = req.body[section][key];
          }
        } else {
          settings[section] = req.body[section];
        }
      }
      await settings.save();
    }

    res.status(200).json({ success: true, data: settings });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
