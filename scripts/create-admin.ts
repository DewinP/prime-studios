import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function createAdminUser() {
  try {
    // Create an admin user
    const adminUser = await prisma.user.upsert({
      where: { email: "admin@example.com" },
      update: {
        role: "admin",
      },
      create: {
        id: "admin-user-id",
        name: "Admin User",
        email: "admin@example.com",
        emailVerified: true,
        role: "admin",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    console.log("✅ Admin user created/updated:", adminUser.email);
    console.log("Role:", adminUser.role);

    // You can now sign in with:
    // Email: admin@example.com
    // Password: (use the signup form to set a password)
  } catch (error) {
    console.error("❌ Failed to create admin user:", error);
  } finally {
    await prisma.$disconnect();
  }
}

void createAdminUser();
