# Tzusu Self

Personal blog, portfolio, project showcase, and controlled chat system.
## Tech Stack

Frontend:

```txt
NextJS
TypeScript
TailwindCSS
```

Backend:

```txt
NestJS
MongoDB Atlas
Mongoose
Swagger
RBAC: User, Role, Permission
```

Package manager:

```txt
pnpm
```

## Project Structure

```txt
RealTime-Chat_MongoDB_NodeJS_Express/
  fe-tzusu_self/          # Frontend NextJS
  be-tzusu_self/          # Backend NestJS
  doc/                    # Huong dan chi tiet tung buoc
  ROADMAP.md              # Roadmap tong quan
  README.md
```

Backend structure chinh:

```txt
be-tzusu_self/src/
  common/
    pipes/
    utils/
  health/
  infrastructure/
    database/
  modules/
    permissions/
    roles/
    users/
  seeds/
```

## Prerequisites

Can cai truoc:

```powershell
node -v
pnpm -v
git --version
docker --version
```

Neu chua co pnpm:

```powershell
npm install -g pnpm
```

## Environment

Tao file backend env:

```txt
be-tzusu_self/.env
```

Co the xem mau tai:

```txt
be-tzusu_self/.env.example
```

Noi dung can co:

```env
PORT=4000
FRONTEND_URL=http://localhost:3000
NODE_DNS_SERVERS=1.1.1.1,8.8.8.8

MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/tzusu_self?retryWrites=true&w=majority

JWT_ACCESS_SECRET=change_me
JWT_REFRESH_SECRET=change_me

SEED_ADMIN_EMAIL=admin@example.com
SEED_ADMIN_USERNAME=admin
SEED_ADMIN_PASSWORD=change_me_admin_password
SEED_ADMIN_DISPLAY_NAME=Tzusu Admin
```

Khong commit `.env` len GitHub.

## Run Locally

Frontend:

```powershell
cd fe-tzusu_self
pnpm dev
```

Frontend mac dinh chay tai:

```txt
http://localhost:3000
```

Backend:

```powershell
cd be-tzusu_self
pnpm start:dev
```

Backend mac dinh chay tai:

```txt
http://localhost:4000
```

Kiem tra backend:

```txt
GET http://localhost:4000/health
```

Swagger docs:

```txt
http://localhost:4000/api/docs
```

## Seed RBAC

Sau khi da them `SEED_ADMIN_*` vao `be-tzusu_self/.env`, chay:

```powershell
cd be-tzusu_self
pnpm seed
```

Seed se tao:

- Permissions mac dinh.
- Role `admin`.
- Role `member`.
- Admin dau tien.

Permission quan trong:

```txt
chat:request
chat:use
profile:view:registered
profile:view:private
profile:manage
blog:create
blog:update
blog:delete
blog:publish
project:create
project:update
project:delete
user:manage
role:manage
permission:manage
```

## Current API

Health:

```txt
GET /health
```

Permissions:

```txt
GET /permissions
POST /permissions
```

Roles:

```txt
GET /roles
GET /roles/:id
POST /roles
PATCH /roles/:id/permissions
```

Users:

```txt
GET /users/:id
POST /users
PATCH /users/:id/role
PATCH /users/:id/permissions/grant
PATCH /users/:id/permissions/deny
```

Note: cac route nay hien tai la base API cho giai doan RBAC. Sau khi co AuthModule, cac route quan tri se duoc bao ve bang guard.

## Validation Rules

Tang validation hien tai:

```txt
DTO / Pipe:
  validate input shape, ObjectId, enum, required fields

Service:
  validate nghiep vu, duplicate, not found, permission/role ton tai

Repository:
  thao tac database

MongoDB index:
  lop bao ve cuoi cung cho unique constraint
```

Vi du response:

```json
{
  "message": "Email already exists",
  "error": "Conflict",
  "statusCode": 409
}
```

## Docs

Tai lieu chi tiet nam trong:

```txt
doc/
```

Nen doc theo thu tu:

```txt
ROADMAP.md
doc/PHASE-2-RBAC-AUTH.md
doc/STEP-01-COMPLETE-RBAC-MODULES.md
doc/STEP-01-RBAC-MODULES-CHECK.md
doc/STEP-01-DTO-VALIDATION-ERRORS.md
doc/STEP-01-VALIDATION-LAYERS.md
doc/STEP-02-SEED-RBAC.md
```

## Next Steps

Sau RBAC + seed, buoc tiep theo:

```txt
AuthModule
POST /auth/register
POST /auth/login
GET /auth/me
JWT access token
Refresh token
Admin guards
Permission guards
```

Sau auth:

```txt
Profile sections
Blog posts
Project showcase
Chat access request
Realtime chat
```
