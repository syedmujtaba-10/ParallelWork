import mongoose, { Schema, Document } from 'mongoose';

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
  duration?: number; // Virtual property in minutes
}

const FlightSchema: Schema = new Schema({
  flightNumber: {
    type: String,
    required: [true, 'Flight number is required'],
    unique: true,
    uppercase: true,
    trim: true,
    match: [/^[A-Z]{2}\d{3,4}$/, 'Flight number must be in format like AA123 or DL1234']
  },
  airline: {
    type: String,
    required: [true, 'Airline is required'],
    trim: true
  },
  origin: {
    type: String,
    required: [true, 'Origin airport is required'],
    uppercase: true,
    trim: true,
    minlength: [3, 'Airport code must be 3 characters'],
    maxlength: [3, 'Airport code must be 3 characters']
  },
  destination: {
    type: String,
    required: [true, 'Destination airport is required'],
    uppercase: true,
    trim: true,
    minlength: [3, 'Airport code must be 3 characters'],
    maxlength: [3, 'Airport code must be 3 characters']
  },
  departureTime: {
    type: Date,
    required: [true, 'Departure time is required']
  },
  arrivalTime: {
    type: Date,
    required: [true, 'Arrival time is required']
  },
  status: {
    type: String,
    enum: ['on-time', 'delayed', 'cancelled'],
    default: 'on-time'
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price must be a positive number']
  },
  availableSeats: {
    type: Number,
    default: 180,
    min: [0, 'Available seats cannot be negative']
  }
});

// Virtual property to calculate flight duration in minutes
FlightSchema.virtual('duration').get(function(this: IFlight) {
  const durationMs = this.arrivalTime.getTime() - this.departureTime.getTime();
  return Math.floor(durationMs / (1000 * 60)); // Convert to minutes
});

// Ensure virtuals are included in JSON output
FlightSchema.set('toJSON', { virtuals: true });
FlightSchema.set('toObject', { virtuals: true });

// Indexes for efficient querying (flightNumber already has unique index from schema)
FlightSchema.index({ origin: 1, destination: 1 });
FlightSchema.index({ departureTime: 1 });

export default mongoose.model<IFlight>('Flight', FlightSchema);
