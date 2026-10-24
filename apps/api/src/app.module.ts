import { Module } from '@nestjs/common';
import { PrismaModule } from './common/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { WorkspacesModule } from './modules/tenants/workspaces.module';
import { LocationsModule } from './modules/locations/locations.module';
import { ServicesModule } from './modules/services/services.module';
import { StaffModule } from './modules/staff/staff.module';
import { AvailabilityModule } from './modules/availability/availability.module';
import { BookingsModule } from './modules/bookings/bookings.module';
import { PublicModule } from './modules/public/public.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { CalendarsModule } from './modules/calendars/calendars.module';
import { DeveloperModule } from './modules/developer/developer.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    WorkspacesModule,
    LocationsModule,
    ServicesModule,
    StaffModule,
    AvailabilityModule,
    BookingsModule,
    PublicModule,
    PaymentsModule,
    AnalyticsModule,
    CalendarsModule,
    DeveloperModule,
  ],
})
export class AppModule {}
