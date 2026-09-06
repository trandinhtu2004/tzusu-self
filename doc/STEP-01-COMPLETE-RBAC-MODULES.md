# Step 01 - Hoan thien module Permission, Role, User

Muc tieu cua buoc nay:

- NestJS nhan duoc 3 module `PermissionsModule`, `RolesModule`, `UsersModule`.
- Moi module dang ky MongoDB schema bang `MongooseModule.forFeature`.
- `AppModule` import 3 module nay.
- Backend build duoc.

Chua can lam register/login trong buoc nay.

## Trang thai hien tai

Ban da co schema:

```txt
src/modules/permissions/entities/permission.schema.ts
src/modules/roles/entities/role.schema.ts
src/modules/users/entities/user.schema.ts
```

Ban da co file:

```txt
src/modules/users/user.module.ts
```

Nhung file `user.module.ts` hien dang trong. Ngoai ra `permissions` va `roles` chua co module/service/controller day du.

## Cau truc nen co sau buoc nay

Hoan thanh xong thi backend nen co:

```txt
src/modules/permissions/
  controllers/
    permissions.controller.ts
  entities/
    permission.schema.ts
  permissions.module.ts
  permissions.service.ts

src/modules/roles/
  controllers/
    roles.controller.ts
  entities/
    role.schema.ts
  roles.module.ts
  roles.service.ts

src/modules/users/
  controllers/
    users.controller.ts
  dto/
  entities/
    user.schema.ts
  interfaces/
  repositories/
  services/
    users.service.ts
  user.module.ts
```

Neu muon dong bo ten folder, ban co the doi `user.module.ts` thanh `users.module.ts`, nhung hien tai chua bat buoc. Quan trong la import/export dung.

## Buoc A - Kiem tra schema names

Khi dung Mongoose, ban can thong nhat ten model:

```txt
Permission
Role
User
```

Vi trong schema cua ban co ref:

```ts
ref: 'Permission'
ref: 'Role'
```

Nen khi dang ky model trong module, phai dung dung ten:

```ts
{ name: 'Permission', schema: PermissionSchema }
{ name: 'Role', schema: RoleSchema }
{ name: 'User', schema: UserSchema }
```

Neu dat sai ten, populate/ref ve sau se loi kho tim model.

## Buoc B - Tao PermissionsModule

Tao file:

```txt
src/modules/permissions/permissions.module.ts
```

No can lam 3 viec:

```txt
1. import MongooseModule
2. dang ky PermissionSchema
3. export PermissionsService de module khac dung duoc
```

Khung y tuong:

```ts
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Permission', schema: PermissionSchema },
    ]),
  ],
  controllers: [PermissionsController],
  providers: [PermissionsService],
  exports: [PermissionsService],
})
export class PermissionsModule {}
```

Tao file service:

```txt
src/modules/permissions/permissions.service.ts
```

Service buoc nay chi can co khung:

```txt
findAll()
findByName(name)
create(data)
```

Tao file controller:

```txt
src/modules/permissions/controllers/permissions.controller.ts
```

Controller buoc nay co the de rat mong, vi sau nay admin API moi can chi tiet.

## Buoc C - Tao RolesModule

Tao file:

```txt
src/modules/roles/roles.module.ts
```

No can dang ky `RoleSchema`:

```ts
MongooseModule.forFeature([
  { name: 'Role', schema: RoleSchema },
])
```

RolesModule nen import `PermissionsModule`, vi role co danh sach permission:

```txt
RolesModule
-> can doc permission khi tao role / gan permission
```

Khung y tuong:

```ts
@Module({
  imports: [
    PermissionsModule,
    MongooseModule.forFeature([
      { name: 'Role', schema: RoleSchema },
    ]),
  ],
  controllers: [RolesController],
  providers: [RolesService],
  exports: [RolesService],
})
export class RolesModule {}
```

Service buoc nay can:

```txt
findAll()
findByName(name)
create(data)
attachPermissions(roleId, permissionIds)
```

## Buoc D - Hoan thien UsersModule

File hien tai:

```txt
src/modules/users/user.module.ts
```

Can dang ky `UserSchema`:

```ts
MongooseModule.forFeature([
  { name: 'User', schema: UserSchema },
])
```

UsersModule nen import:

```txt
RolesModule
PermissionsModule
```

Ly do:

- User co `role`.
- User co `grantedPermissions`.
- User co `deniedPermissions`.
- Sau nay service can set role, grant permission, deny permission.

Khung y tuong:

```ts
@Module({
  imports: [
    RolesModule,
    PermissionsModule,
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
```

Service buoc nay can:

```txt
findById(id)
findByEmail(email)
findByUsername(username)
create(data)
setRole(userId, roleId)
grantPermission(userId, permissionId)
denyPermission(userId, permissionId)
```

## Buoc E - Import vao AppModule

Mo:

```txt
src/app.module.ts
```

Sau khi co 3 module, import:

```txt
PermissionsModule
RolesModule
UsersModule
```

Thu tu nen de:

```txt
ConfigModule
DatabaseModule
PermissionsModule
RolesModule
UsersModule
HealthModule
```

Thu tu nay de doc, khong phai luc nao cung bat buoc ve runtime.

## Buoc F - Test build

Chay trong backend:

```powershell
cd be-tzusu_self
pnpm build
```

Neu `pnpm build` gap loi prompt node_modules, chay bang cach truc tiep:

```powershell
.\node_modules\.bin\nest.cmd build
```

Ket qua mong muon:

```txt
build thanh cong, khong co TypeScript error
```

## Buoc G - Test app start

Chay:

```powershell
pnpm start:dev
```

Hoac neu can DNS Atlas:

```powershell
$env:NODE_DNS_SERVERS="1.1.1.1,8.8.8.8"
pnpm start:dev
```

Mo:

```txt
http://localhost:4000/health
```

Ket qua mong muon:

```json
{
  "status": "ok"
}
```

## Loi hay gap

### Loi Cannot find module

Thuong do import sai path.

Kiem tra:

```txt
../../permissions/permissions.module
../entities/user.schema
```

### Loi Nest cannot export provider

Thuong do service chua nam trong `providers`, nhung lai dem export.

Dung pattern:

```ts
providers: [UsersService],
exports: [UsersService],
```

### Loi Schema hasn't been registered

Thuong do ten model/ref khong trung nhau.

Kiem tra:

```txt
ref: 'Role'
name: 'Role'
```

Va:

```txt
ref: 'Permission'
name: 'Permission'
```

### Loi circular dependency

Trong buoc nay tranh de:

```txt
RolesModule import UsersModule
UsersModule import RolesModule
```

Chieu nen la:

```txt
UsersModule -> RolesModule -> PermissionsModule
```

Khong can roles import users.

## Dieu kien xong buoc 1

Buoc nay xong khi:

- Co day du `PermissionsModule`, `RolesModule`, `UsersModule`.
- Moi module co service rieng.
- Moi module dang ky schema rieng bang `MongooseModule.forFeature`.
- `AppModule` import 3 module.
- Backend build duoc.
- Backend start duoc va `/health` van OK.

## Sau buoc nay lam gi

Sau khi buoc 1 xong, tiep theo la:

```txt
Step 02 - Viet service CRUD noi bo cho permissions, roles, users
Step 03 - Seed permission/role/admin dau tien
Step 04 - Auth register/login
```

Chua nen lam UI login/register luc nay. Nen lam backend auth on truoc roi moi noi frontend.
