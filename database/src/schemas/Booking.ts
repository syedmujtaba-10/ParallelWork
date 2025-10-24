import mongoose, { Schema, Document } from 'mongoose';

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

// Helper function to generate confirmation number
function generateConfirmationNumber(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'BK-';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

const BookingSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  flightNumber: {
    type: String,
    required: [true, 'Flight number is required'],
    uppercase: true,
    trim: true
  },
  confirmationNumber: {
    type: String,
    unique: true
  },
  status: {
    type: String,
    enum: ['confirmed', 'cancelled'],
    default: 'confirmed'
  },
  passengerName: {
    type: String,
    required: [true, 'Passenger name is required'],
    trim: true
  },
  passengerEmail: {
    type: String,
    required: [true, 'Passenger email is required'],
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
  },
  bookingDate: {
    type: Date,
    default: Date.now
  },
  travelDate: {
    type: Date,
    required: [true, 'Travel date is required']
  }
});

// Pre-save hook to generate confirmation number
BookingSchema.pre<IBooking>('save', async function(next) {
  if (!this.confirmationNumber) {
    let unique = false;
    while (!unique) {
      const confNum = generateConfirmationNumber();
      const existing = await mongoose.model('Booking').findOne({ confirmationNumber: confNum });
      if (!existing) {
        this.confirmationNumber = confNum;
        unique = true;
      }
    }
  }
  next();
});

// Indexes for duplicate booking detection (confirmationNumber already has unique index from schema)
BookingSchema.index({ userId: 1, flightNumber: 1 });
BookingSchema.index({ userId: 1 });

export default mongoose.model<IBooking>('Booking', BookingSchema);
