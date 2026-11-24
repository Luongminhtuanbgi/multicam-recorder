import bcrypt from 'bcrypt';
import { PrismaClient, UserRole, UserStatus } from '@prisma/client';
import { createPrefixedId } from '../src/common/utils/ids';
import { env } from '../src/config/env';

const BCRYPT_ROUNDS = 10;
const prisma = new PrismaClient();

export async function seedController(client: PrismaClient = prisma): Promise<void> {
  const email = env.CONTROLLER_EMAIL.toLowerCase();
  const phone = env.CONTROLLER_PHONE;
  const passwordHash = await bcrypt.hash(env.CONTROLLER_PASSWORD, BCRYPT_ROUNDS);

  const existingController = await client.user.findFirst({
    where: {
      OR: [{ role: UserRole.controller }, { email }, { phone }],
    },
  });

  if (existingController) {
    await client.user.update({
      where: { id: existingController.id },
      data: {
        firstName: env.CONTROLLER_FIRST_NAME,
        lastName: env.CONTROLLER_LAST_NAME,
        email,
        phone,
        passwordHash,
        role: UserRole.controller,
        status: UserStatus.active,
      },
    });
    console.log(
      `[seed] Updated Controller account: id=${existingController.id}, phone=${phone}, email=${email}`
    );
    return;
  }

  const created = await client.user.create({
    data: {
      id: createPrefixedId('u'),
      firstName: env.CONTROLLER_FIRST_NAME,
      lastName: env.CONTROLLER_LAST_NAME,
      email,
      phone,
      passwordHash,
      role: UserRole.controller,
      status: UserStatus.active,
    },
  });

  console.log(
    `[seed] Created Controller account: id=${created.id}, phone=${phone}, email=${email}`
  );
}

if (require.main === module) {
  seedController()
    .then(async () => {
      await prisma.$disconnect();
    })
    .catch(async (err) => {
      console.error('[seed] Failed to seed Controller account:', err);
      await prisma.$disconnect();
      process.exit(1);
    });
}
