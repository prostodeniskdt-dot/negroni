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
    const email = normalizeEmail(adminEmail);
    const passwordHash = await bcrypt.hash(adminPassword, 12);
    const hasAnyAdmin = (await prisma.user.count({ where: { role: 'admin' } })) > 0;
    if (hasAnyAdmin) return;

    await prisma.user.upsert({
      where: { email },
      update: { passwordHash, role: 'admin' },
      create: { email, passwordHash, role: 'admin' },
      select: { id: true },
    });
    // eslint-disable-next-line no-console
    console.log(`[bootstrap-admin] ensured admin user: ${email}`);
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

