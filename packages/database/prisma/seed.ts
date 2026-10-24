import { PrismaClient, WorkspaceRole, ResourceType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding SlotSync database...');

  // 1. Create or upsert Demo Owner
  const owner = await prisma.user.upsert({
    where: { email: 'owner@urbansalon.com' },
    update: {},
    create: {
      email: 'owner@urbansalon.com',
      // In production, bcrypt-hashed. For seed/demo:
      passwordHash: '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyUIXe/GeSUG6deWbLz3Jk7p0e9y0E1e', // "password123"
      name: 'Victoria Vance',
      verifiedAt: new Date(),
    },
  });
  console.log(`👤 Owner user created: ${owner.email} (${owner.id})`);

  // 2. Create Workspace
  const workspace = await prisma.workspace.upsert({
    where: { slug: 'urban-salon' },
    update: {},
    create: {
      name: 'Urban Salon & Spa',
      slug: 'urban-salon',
      ownerId: owner.id,
      defaultTimezone: 'America/New_York',
      currency: 'USD',
    },
  });
  console.log(`🏢 Workspace created: ${workspace.name} [${workspace.slug}]`);

  // 3. Workspace Member
  await prisma.workspaceMember.upsert({
    where: {
      workspaceId_userId: {
        workspaceId: workspace.id,
        userId: owner.id,
      },
    },
    update: {},
    create: {
      workspaceId: workspace.id,
      userId: owner.id,
      role: WorkspaceRole.OWNER,
    },
  });

  // 4. Create Locations
  const downtown = await prisma.location.upsert({
    where: {
      workspaceId_slug: {
        workspaceId: workspace.id,
        slug: 'manhattan-flagship',
      },
    },
    update: {},
    create: {
      workspaceId: workspace.id,
      name: 'Downtown Manhattan Flagship',
      slug: 'manhattan-flagship',
      timezone: 'America/New_York',
      address: '452 Broadway, SoHo, New York, NY 10013',
      phone: '+1 (212) 555-0199',
      email: 'soho@urbansalon.com',
      isActive: true,
    },
  });
  console.log(`📍 Location created: ${downtown.name} (${downtown.timezone})`);

  // 5. Create Services
  const haircut = await prisma.service.create({
    data: {
      workspaceId: workspace.id,
      name: 'Signature Haircut & Styling',
      description: 'Precision scissor cut, relaxing botanical scalp wash, and signature blowout.',
      durationMinutes: 45,
      bufferBeforeMinutes: 5,
      bufferAfterMinutes: 10,
      priceMinor: 7500, // $75.00
      currency: 'USD',
      bookingLeadMinutes: 60,
      bookingHorizonDays: 45,
      isPublic: true,
      serviceLocations: {
        create: { locationId: downtown.id },
      },
    },
  });

  const balayage = await prisma.service.create({
    data: {
      workspaceId: workspace.id,
      name: 'Artisan Balayage & Gloss',
      description: 'Hand-painted multidimensional highlights finished with an ultra-gloss toner and conditioning treatment.',
      durationMinutes: 120,
      bufferBeforeMinutes: 10,
      bufferAfterMinutes: 15,
      priceMinor: 22000, // $220.00
      currency: 'USD',
      bookingLeadMinutes: 120,
      bookingHorizonDays: 60,
      isPublic: true,
      serviceLocations: {
        create: { locationId: downtown.id },
      },
    },
  });

  const beardTrim = await prisma.service.create({
    data: {
      workspaceId: workspace.id,
      name: 'Beard Sculpting & Hot Towel Treatment',
      description: 'Straight-razor detailing, essential oil hot towel wrap, and nourishing beard butter finish.',
      durationMinutes: 30,
      bufferBeforeMinutes: 5,
      bufferAfterMinutes: 5,
      priceMinor: 4000, // $40.00
      currency: 'USD',
      bookingLeadMinutes: 30,
      bookingHorizonDays: 30,
      isPublic: true,
      serviceLocations: {
        create: { locationId: downtown.id },
      },
    },
  });
  console.log(`✂️ Services seeded: ${haircut.name}, ${balayage.name}, ${beardTrim.name}`);

  // 6. Create Staff Profiles
  const elena = await prisma.staffProfile.create({
    data: {
      workspaceId: workspace.id,
      displayName: 'Elena Rostova',
      bio: 'Master Colorist & Editorial Stylist with 10+ years experience in London and NYC.',
      isActive: true,
      staffLocations: {
        create: { locationId: downtown.id },
      },
      staffServices: {
        create: [
          { serviceId: haircut.id },
          { serviceId: balayage.id },
        ],
      },
    },
  });

  const marcus = await prisma.staffProfile.create({
    data: {
      workspaceId: workspace.id,
      displayName: 'Marcus Thorne',
      bio: 'Classic Barber & Precision Fade Specialist.',
      isActive: true,
      staffLocations: {
        create: { locationId: downtown.id },
      },
      staffServices: {
        create: [
          { serviceId: haircut.id },
          { serviceId: beardTrim.id },
        ],
      },
    },
  });
  console.log(`💇 Staff profiles created: ${elena.displayName}, ${marcus.displayName}`);

  // 7. Seed Staff Working Hours (Monday through Saturday)
  for (const staff of [elena, marcus]) {
    // Mon-Fri: 9:00 - 18:00 with lunch break 13:00 - 14:00
    for (let day = 1; day <= 5; day++) {
      await prisma.workingHours.create({
        data: {
          staffId: staff.id,
          locationId: downtown.id,
          weekday: day,
          startLocal: '09:00',
          endLocal: '18:00',
          breakStart: '13:00',
          breakEnd: '14:00',
        },
      });
    }
    // Saturday: 10:00 - 16:00
    await prisma.workingHours.create({
      data: {
        staffId: staff.id,
        locationId: downtown.id,
        weekday: 6,
        startLocal: '10:00',
        endLocal: '16:00',
      },
    });
  }
  console.log(`⏰ Working hours populated for Elena and Marcus.`);

  // 8. Seed Styling Station Resources
  await prisma.resource.create({
    data: {
      workspaceId: workspace.id,
      locationId: downtown.id,
      type: ResourceType.CHAIR,
      name: 'VIP Styling Station 1',
      capacity: 1,
      isActive: true,
    },
  });

  console.log('✅ SlotSync seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
