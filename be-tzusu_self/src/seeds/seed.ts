import { randomBytes, scryptSync } from 'node:crypto';
import { setServers } from 'node:dns';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import mongoose from 'mongoose';
import { PermissionSchema } from '../modules/permissions/entities/permission.schema';
import { RoleSchema } from '../modules/roles/entities/role.schema';
import { UserSchema } from '../modules/users/entities/user.schema';

type PermissionSeed = {
  name: string;
  description: string;
};

const permissions: PermissionSeed[] = [
  {
    name: 'profile:view:registered',
    description: 'View profile content available for logged-in users.',
  },
  {
    name: 'profile:view:private',
    description: 'View private profile content approved by admin.',
  },
  {
    name: 'profile:manage',
    description: 'Create, update, and control profile sections.',
  },
  {
    name: 'blog:create',
    description: 'Create blog posts.',
  },
  {
    name: 'blog:update',
    description: 'Update blog posts.',
  },
  {
    name: 'blog:delete',
    description: 'Delete blog posts.',
  },
  {
    name: 'blog:publish',
    description: 'Publish or unpublish blog posts.',
  },
  {
    name: 'project:create',
    description: 'Create project showcase entries.',
  },
  {
    name: 'project:update',
    description: 'Update project showcase entries.',
  },
  {
    name: 'project:delete',
    description: 'Delete project showcase entries.',
  },
  {
    name: 'chat:request',
    description: 'Request access to the chat feature.',
  },
  {
    name: 'chat:use',
    description: 'Use the chat feature after admin approval.',
  },
  {
    name: 'user:manage',
    description: 'Manage users and user status.',
  },
  {
    name: 'role:manage',
    description: 'Manage roles.',
  },
  {
    name: 'permission:manage',
    description: 'Manage permissions.',
  },
];

const roleSeeds = [
  {
    name: 'admin',
    description: 'Full access administrator.',
    permissionNames: permissions.map((permission) => permission.name),
  },
  {
    name: 'member',
    description: 'Default role for registered users.',
    permissionNames: ['profile:view:registered', 'chat:request'],
  },
];

const PermissionModel =
  mongoose.models.Permission || mongoose.model('Permission', PermissionSchema);
const RoleModel = mongoose.models.Role || mongoose.model('Role', RoleSchema);
const UserModel = mongoose.models.User || mongoose.model('User', UserSchema);

async function bootstrap() {
  loadEnv();
  configureDnsServers();
  validateSeedEnv();

  const mongodbUri = requiredEnv('MONGODB_URI');
  await mongoose.connect(mongodbUri);

  const permissionDocs = await seedPermissions();
  const roles = await seedRoles(permissionDocs);
  await seedAdmin(roles.admin._id);

  console.log('Seed completed');
  console.log(`Permissions: ${permissionDocs.length}`);
  console.log(`Roles: ${Object.keys(roles).join(', ')}`);
}

function validateSeedEnv() {
  requiredEnv('MONGODB_URI');
  requiredEnv('SEED_ADMIN_EMAIL');
  requiredEnv('SEED_ADMIN_USERNAME');
  requiredEnv('SEED_ADMIN_PASSWORD');
}

async function seedPermissions() {
  const docs = [];

  for (const permission of permissions) {
    const doc = await PermissionModel.findOneAndUpdate(
      { name: permission.name },
      { $set: permission },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    ).exec();

    docs.push(doc);
  }

  return docs;
}

async function seedRoles(permissionDocs: any[]) {
  const permissionByName = new Map(
    permissionDocs.map((permission) => [
      permission.name as string,
      permission._id,
    ]),
  );

  const roles: Record<string, any> = {};

  for (const role of roleSeeds) {
    const permissionIds = role.permissionNames.map((name) =>
      permissionByName.get(name),
    );

    const doc = await RoleModel.findOneAndUpdate(
      { name: role.name },
      {
        $set: {
          name: role.name,
          description: role.description,
          permissions: permissionIds,
        },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    ).exec();

    roles[role.name] = doc;
  }

  return roles as { admin: any; member: any };
}

async function seedAdmin(adminRoleId: mongoose.Types.ObjectId) {
  const email = requiredEnv('SEED_ADMIN_EMAIL').toLowerCase();
  const username = requiredEnv('SEED_ADMIN_USERNAME');
  const displayName = process.env.SEED_ADMIN_DISPLAY_NAME || 'Tzusu Admin';
  const password = requiredEnv('SEED_ADMIN_PASSWORD');

  const existingAdmin = await UserModel.findOne({ email }).exec();

  if (existingAdmin) {
    await UserModel.updateOne(
      { email },
      {
        $set: {
          username,
          displayName,
          role: adminRoleId,
          status: 'active',
        },
      },
    ).exec();

    console.log(`Admin already exists, updated role/status: ${email}`);
    return;
  }

  await UserModel.create({
    email,
    username,
    displayName,
    passwordHash: hashPassword(password),
    role: adminRoleId,
    status: 'active',
    grantedPermissions: [],
    deniedPermissions: [],
    lastLoginAt: null,
  });

  console.log(`Admin created: ${email}`);
}

function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, 64).toString('hex');

  return `scrypt$${salt}$${hash}`;
}

function loadEnv() {
  const envPath = resolve(process.cwd(), '.env');

  if (!existsSync(envPath)) {
    return;
  }

  const envText = readFileSync(envPath, 'utf8');

  for (const line of envText.split(/\r?\n/)) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) {
      continue;
    }

    const [key, ...valueParts] = trimmed.split('=');
    const value = valueParts.join('=').trim();

    if (!process.env[key]) {
      process.env[key] = value.replace(/^["']|["']$/g, '');
    }
  }
}

function configureDnsServers() {
  const dnsServers = process.env.NODE_DNS_SERVERS?.split(',')
    .map((server) => server.trim())
    .filter(Boolean);

  if (dnsServers?.length) {
    setServers(dnsServers);
  }
}

function requiredEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required env: ${name}`);
  }

  return value;
}

bootstrap()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
