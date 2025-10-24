import { Router, Response } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import { Booking } from '../models/Booking';
import { Flight } from '../models/Flight';

const router = Router();

/**
 * @route   GET /api/bookings
 * @desc    Get all bookings for the authenticated user
 * @access  Private
 */
router.get('/', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        error: 'User not authenticated',
      });
      return;
    }

    const bookings = await Booking.find({ userId }).sort({ bookingDate: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error: any) {
    console.error('Get bookings error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error retrieving bookings',
    });
  }
});

/**
 * @route   GET /api/bookings/:id
 * @desc    Get specific booking by ID
 * @access  Private
 */
router.get('/:id', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const bookingId = req.params.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        error: 'User not authenticated',
      });
      return;
    }

    const booking = await Booking.findOne({
      _id: bookingId,
      userId, // Ensure user can only access their own bookings
    });

    if (!booking) {
      res.status(404).json({
        success: false,
        error: 'Booking not found',
      });
      return;
    }

    // Get flight details
    const flight = await Flight.findOne({ flightNumber: booking.flightNumber });

    res.status(200).json({
      success: true,
      booking,
      flight,
    });
  } catch (error: any) {
    console.error('Get booking error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error retrieving booking',
    });
  }
});

/**
 * @route   GET /api/bookings/confirmation/:confirmationNumber
 * @desc    Get booking by confirmation number
 * @access  Private
 */
router.get(
  '/confirmation/:confirmationNumber',
  authenticate,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      const confirmationNumber = req.params.confirmationNumber.toUpperCase();

      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'User not authenticated',
        });
        return;
      }

      const booking = await Booking.findOne({
        confirmationNumber,
        userId, // Ensure user can only access their own bookings
      });

      if (!booking) {
        res.status(404).json({
          success: false,
          error: 'Booking not found with this confirmation number',
        });
        return;
      }

      // Get flight details
      const flight = await Flight.findOne({ flightNumber: booking.flightNumber });

      res.status(200).json({
        success: true,
        booking,
        flight,
      });
    } catch (error: any) {
      console.error('Get booking by confirmation error:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Server error retrieving booking',
      });
    }
  }
);

export default router;
