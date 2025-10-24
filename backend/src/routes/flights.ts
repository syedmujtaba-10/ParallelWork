import { Router, Request, Response } from 'express';
import { Flight } from '../models/Flight';

const router = Router();

/**
 * @route   GET /api/flights
 * @desc    Get all available flights
 * @access  Public
 */
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { origin, destination, status } = req.query;

    // Build query filter
    const filter: any = {};

    if (origin) {
      filter.origin = (origin as string).toUpperCase();
    }

    if (destination) {
      filter.destination = (destination as string).toUpperCase();
    }

    if (status) {
      filter.status = status;
    }

    const flights = await Flight.find(filter).sort({ departureTime: 1 });

    res.status(200).json({
      success: true,
      count: flights.length,
      flights,
    });
  } catch (error: any) {
    console.error('Get flights error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error retrieving flights',
    });
  }
});

/**
 * @route   GET /api/flights/:flightNumber
 * @desc    Get flight by flight number
 * @access  Public
 */
router.get('/:flightNumber', async (req: Request, res: Response): Promise<void> => {
  try {
    const flightNumber = req.params.flightNumber.toUpperCase();

    const flight = await Flight.findOne({ flightNumber });

    if (!flight) {
      res.status(404).json({
        success: false,
        error: 'Flight not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      flight,
    });
  } catch (error: any) {
    console.error('Get flight error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error retrieving flight',
    });
  }
});

export default router;
