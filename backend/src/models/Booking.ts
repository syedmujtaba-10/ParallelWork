import mongoose, { Document, Schema } from 'mongoose';

/**
 * Booking interface extending Mongoose Document
 */
export interface IBooking extends Document {
  userId: mongoose.Types.ObjectId;
  flightNumber: string;
  confirmationNumber: string;
  status: 'confirmed' | 'cancelled';
  passengerName: string;
  passengerEmail: string;
  bookingDate: Date;
  travelDate: Date;
}

/**
 * Generate unique confirmation number
 * Format: BK-XXXXXX (6 random alphanumeric characters)
 */
const generateConfirmationNumber = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'BK-';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Booking Schema
 */
const BookingSchema = new Schema<IBooking>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
  },
  flightNumber: {
    type: String,
    required: [true, 'Flight number is required'],
    uppercase: true,
    trim: true,
  },
  confirmationNumber: {
    type: String,
    unique: true,
    default: generateConfirmationNumber,
  },
  status: {
    type: String,
    enum: {
      values: ['confirmed', 'cancelled'],
      message: '{VALUE} is not a valid status',
    },
    default: 'confirmed',
  },
  passengerName: {
    type: String,
    required: [true, 'Passenger name is required'],
    trim: true,
  },
  passengerEmail: {
    type: String,
    required: [true, 'Passenger email is required'],
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
  },
  bookingDate: {
    type: Date,
    default: Date.now,
  },
  travelDate: {
    type: Date,
    required: [true, 'Travel date is required'],
  },
});

// Compound index for duplicate detection (userId + flightNumber)
// This ensures a user cannot book the same flight twice
BookingSchema.index({ userId: 1, flightNumber: 1 });

// Index on confirmationNumber for fast lookups
BookingSchema.index({ confirmationNumber: 1 });

// Index on userId for fetching user's bookings
BookingSchema.index({ userId: 1 });

/**
 * Pre-save hook to ensure confirmation number is unique
 */
BookingSchema.pre('save', async function (next) {
  if (!this.confirmationNumber) {
    let isUnique = false;
    let confirmationNumber = '';

    // Keep generating until we get a unique confirmation number
    while (!isUnique) {
      confirmationNumber = generateConfirmationNumber();
      const existing = await mongoose.model('Booking').findOne({
        confirmationNumber,
      });
      if (!existing) {
        isUnique = true;
      }
    }

    this.confirmationNumber = confirmationNumber;
  }

  next();
});

export const Booking = mongoose.model<IBooking>('Booking', BookingSchema);
