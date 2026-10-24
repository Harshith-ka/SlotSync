// -------------------------------------------------------------
// ENUMS
// -------------------------------------------------------------

export enum WorkspaceRole {
  OWNER = 'OWNER',
  MANAGER = 'MANAGER',
  STAFF = 'STAFF',
  RECEPTIONIST = 'RECEPTIONIST'
}

export enum BookingStatus {
  HELD = 'HELD',
  PENDING_PAYMENT = 'PENDING_PAYMENT',
  CONFIRMED = 'CONFIRMED',
  CHECKED_IN = 'CHECKED_IN',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  NO_SHOW = 'NO_SHOW',
  EXPIRED = 'EXPIRED',
  PAYMENT_REVIEW = 'PAYMENT_REVIEW'
}

export enum HoldStatus {
  ACTIVE = 'ACTIVE',
  CONVERTED = 'CONVERTED',
  RELEASED = 'RELEASED',
  EXPIRED = 'EXPIRED'
}

export enum AllocationStatus {
  HELD = 'HELD',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  RELEASED = 'RELEASED'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  SUCCEEDED = 'SUCCEEDED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
  PARTIALLY_REFUNDED = 'PARTIALLY_REFUNDED'
}

export enum PaymentProvider {
  STRIPE = 'STRIPE',
  RAZORPAY = 'RAZORPAY',
  MANUAL = 'MANUAL'
}

export enum ExceptionType {
  TIME_OFF = 'TIME_OFF',
  CUSTOM_HOURS = 'CUSTOM_HOURS',
  HOLIDAY = 'HOLIDAY'
}

export enum ResourceType {
  STAFF = 'STAFF',
  ROOM = 'ROOM',
  EQUIPMENT = 'EQUIPMENT',
  CHAIR = 'CHAIR'
}

// -------------------------------------------------------------
// AUTH & USERS
// -------------------------------------------------------------

export interface UserPayload {
  id: string;
  email: string;
  name: string;
  workspaceId?: string;
  role?: WorkspaceRole;
}

export interface RegisterDto {
  email: string;
  password: string;
  name: string;
  workspaceName?: string;
  workspaceSlug?: string;
  timezone?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
  workspaces: Array<{
    id: string;
    name: string;
    slug: string;
    role: WorkspaceRole;
  }>;
}

// -------------------------------------------------------------
// WORKSPACES & LOCATIONS
// -------------------------------------------------------------

export interface CreateWorkspaceDto {
  name: string;
  slug: string;
  defaultTimezone?: string;
  currency?: string;
}

export interface CreateLocationDto {
  name: string;
  slug: string;
  timezone: string;
  address?: string;
  phone?: string;
  email?: string;
}

export interface UpdateLocationDto {
  name?: string;
  timezone?: string;
  address?: string;
  phone?: string;
  email?: string;
  isActive?: boolean;
}

// -------------------------------------------------------------
// SERVICES
// -------------------------------------------------------------

export interface CreateServiceDto {
  name: string;
  description?: string;
  durationMinutes: number;
  bufferBeforeMinutes?: number;
  bufferAfterMinutes?: number;
  priceMinor: number;
  currency?: string;
  bookingLeadMinutes?: number;
  bookingHorizonDays?: number;
  isPublic?: boolean;
  requiresRoomResource?: boolean;
  locationIds?: string[];
  staffIds?: string[];
}

export interface UpdateServiceDto {
  name?: string;
  description?: string;
  durationMinutes?: number;
  bufferBeforeMinutes?: number;
  bufferAfterMinutes?: number;
  priceMinor?: number;
  currency?: string;
  bookingLeadMinutes?: number;
  bookingHorizonDays?: number;
  isPublic?: boolean;
  requiresRoomResource?: boolean;
  locationIds?: string[];
  staffIds?: string[];
}

// -------------------------------------------------------------
// STAFF & WORKING HOURS
// -------------------------------------------------------------

export interface CreateStaffDto {
  displayName: string;
  email?: string;
  bio?: string;
  locationIds?: string[];
  serviceIds?: string[];
}

export interface WorkingHourItem {
  weekday: number; // 0-6 (Sun-Sat)
  startLocal: string; // "09:00"
  endLocal: string; // "17:00"
  breakStart?: string;
  breakEnd?: string;
}

export interface SetWorkingHoursDto {
  locationId: string;
  hours: WorkingHourItem[];
}

export interface CreateScheduleExceptionDto {
  date: string; // "YYYY-MM-DD"
  type: ExceptionType;
  startLocal?: string;
  endLocal?: string;
  reason?: string;
}

// -------------------------------------------------------------
// AVAILABILITY & BOOKING
// -------------------------------------------------------------

export interface AvailabilityQueryDto {
  serviceId: string;
  locationId: string;
  date: string; // "YYYY-MM-DD"
  timezone: string; // IANA timezone e.g. "Asia/Kolkata" or "America/New_York"
  staffId?: string; // Optional specific staff; if omitted, "any available"
}

export interface TimeSlot {
  startsAt: string; // ISO 8601 UTC string
  endsAt: string;   // ISO 8601 UTC string
  staffId: string;
  staffName: string;
  available: boolean;
}

export interface AvailabilityResponse {
  date: string;
  timezone: string;
  slots: TimeSlot[];
}

export interface CreateHoldDto {
  serviceId: string;
  locationId: string;
  staffId?: string;
  startsAt: string; // UTC ISO string
  customer: {
    name: string;
    email: string;
    phone?: string;
  };
}

export interface HoldResponse {
  holdId: string;
  bookingId: string;
  status: BookingStatus;
  expiresAt: string; // ISO UTC string
  bookingToken: string;
}

export interface ConfirmBookingDto {
  bookingId: string;
  bookingToken: string;
  customerNote?: string;
}

export interface BookingResponse {
  id: string;
  status: BookingStatus;
  startsAt: string;
  endsAt: string;
  totalMinor: number;
  currency: string;
  service: {
    id: string;
    name: string;
    durationMinutes: number;
  };
  location: {
    id: string;
    name: string;
    timezone: string;
    address?: string | null;
  };
  customer: {
    name: string;
    email: string;
    phone?: string | null;
  };
  staff?: {
    id: string;
    displayName: string;
  };
}

// -------------------------------------------------------------
// ERROR CONTRACT
// -------------------------------------------------------------

export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    requestId?: string;
    details?: Record<string, any>;
  };
}
