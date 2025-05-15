import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  try {
    // Get admin details from environment variables
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;
    const fullName = process.env.ADMIN_FULL_NAME;

    if (!email || !password || !fullName) {
      console.error('Admin credentials not found in environment variables');
      console.error('Please set ADMIN_EMAIL, ADMIN_PASSWORD, and ADMIN_FULL_NAME environment variables');
      process.exit(1);
    }

    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email },
    });

    if (existingAdmin) {
      console.log(`Admin user with email ${email} already exists`);
      process.exit(0);
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create admin user
    const admin = await prisma.user.create({
      data: {
        email,
        fullName,
        passwordHash,
        lastLoginAt: new Date(),
      },
    });

    console.log(`Admin user created with email: ${admin.email}`);
    console.log(`Admin ID: ${admin.id}`);
  } catch (error) {
    console.error('Error seeding admin user:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 