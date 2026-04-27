import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

function normalizeEmail(email) {
  return String(email || '')
    .trim()
    .toLowerCase();
}

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!process.env.DATABASE_URL) return;
  if (!adminEmail || !adminPassword) return;

  const prisma = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

  try {
    const usersCount = await prisma.user.count();
    if (usersCount > 0) return;

    const email = normalizeEmail(adminEmail);
    const passwordHash = await bcrypt.hash(adminPassword, 12);
    await prisma.user.create({
      data: { email, passwordHash, role: 'admin' },
      select: { id: true },
    });
    // eslint-disable-next-line no-console
    console.log(`[bootstrap-admin] created first admin: ${email}`);
  } finally {
    await prisma.$disconnect().catch(() => {});
  }
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('[bootstrap-admin] failed');
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});

