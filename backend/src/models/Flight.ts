import mongoose, { Document, Schema } from 'mongoose';

/**
 * Flight interface extending Mongoose Document
 */
export interface IFlight extends Document {
  flightNumber: string;
  airline: string;
  origin: string;
  destination: string;
  departureTime: Date;
  arrivalTime: Date;
  status: 'on-time' | 'delayed' | 'cancelled';
  price: number;
  availableSeats: number;
}

/**
 * Flight Schema
 */
const FlightSchema = new Schema<IFlight>({
  flightNumber: {
    type: String,
    required: [true, 'Flight number is required'],
    unique: true,
    uppercase: true,
    trim: true,
  },
  airline: {
    type: String,
    required: [true, 'Airline is required'],
    trim: true,
  },
  origin: {
    type: String,
    required: [true, 'Origin is required'],
    uppercase: true,
    trim: true,
  },
  destination: {
    type: String,
    required: [true, 'Destination is required'],
    uppercase: true,
    trim: true,
  },
  departureTime: {
    type: Date,
    required: [true, 'Departure time is required'],
  },
  arrivalTime: {
    type: Date,
    required: [true, 'Arrival time is required'],
    validate: {
      validator: function (this: IFlight, value: Date) {
        return value > this.departureTime;
      },
      message: 'Arrival time must be after departure time',
    },
  },
  status: {
    type: String,
    enum: {
      values: ['on-time', 'delayed', 'cancelled'],
      message: '{VALUE} is not a valid status',
    },
    default: 'on-time',
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative'],
  },
  availableSeats: {
    type: Number,
    default: 180,
    min: [0, 'Available seats cannot be negative'],
  },
});

// Create index on flightNumber for faster lookups
FlightSchema.index({ flightNumber: 1 });

// Virtual property to calculate flight duration in minutes
FlightSchema.virtual('duration').get(function () {
  const diff = this.arrivalTime.getTime() - this.departureTime.getTime();
  return Math.floor(diff / (1000 * 60)); // Convert to minutes
});

export const Flight = mongoose.model<IFlight>('Flight', FlightSchema);
