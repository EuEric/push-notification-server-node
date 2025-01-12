import { Device } from '../models/device.js';

export async function extractDevice(req, res, next) {
  const { device_id } = req.params;

  // Check if device_id is valid
  if (!device_id || !Number.isInteger(Number(device_id))) {
    return res.status(400).json({ success: false, message: 'Invalid device ID' });
  }

  try {
    // Fetch the device based on the device_id
    const device = await Device.query().findById(device_id).withGraphFetched('users');

    // If no device is found, return 404
    if (!device) {
      return res.status(404).json({ success: false, message: 'Device not found' });
    }

    // Attach the device to the request object
    req.device = device;

    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    console.error('Error fetching device:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}
