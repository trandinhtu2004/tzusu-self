# Step 01 Check - RBAC Modules

Ngay 2026-09-06, da kiem tra va hoan thien khung cho 3 module:

- `PermissionsModule`
- `RolesModule`
- `UsersModule`

## Ket qua Permission

Permission ban dau chua hoan toan OK vi repository dang tra ve mang rong co dinh, chua inject MongoDB model.

Da chinh lai:

- `PermissionSchema` co `timestamps`
- `PermissionRepository` inject model `Permission`
- `findAll()` doc that tu MongoDB
- `findByName(name)` doc theo ten permission
- `createPermission(permission)` tao document that trong MongoDB
- Controller route gon lai thanh:

```txt
GET /permissions
POST /permissions
```

## Ket qua Role

Da them day du:

```txt
src/modules/roles/roles.module.ts
src/modules/roles/controllers/roles.controller.ts
src/modules/roles/services/roles.service.ts
src/modules/roles/repositories/role.repository.ts
src/modules/roles/interfaces/role.interface.ts
```

Route hien co:

```txt
GET /roles
GET /roles/:id
POST /roles
PATCH /roles/:id/permissions
```

Role dang ky schema voi model name:

```txt
Role
```

Model nay populate duoc:

```txt
permissions -> Permission
```

## Ket qua User

Da them day du:

```txt
src/modules/users/controllers/users.controller.ts
src/modules/users/services/users.service.ts
src/modules/users/repositories/user.repository.ts
src/modules/users/interfaces/user.interface.ts
```

Va hoan thien:

```txt
src/modules/users/user.module.ts
```

Route hien co:

```txt
GET /users/:id
POST /users
PATCH /users/:id/role
PATCH /users/:id/permissions/grant
PATCH /users/:id/permissions/deny
```

User dang ky schema voi model name:

```txt
User
```

Model nay populate duoc:

```txt
role -> Role
grantedPermissions -> Permission
deniedPermissions -> Permission
```

## AppModule

Da import:

```txt
PermissionsModule
RolesModule
UsersModule
```

## Verify da chay

Build backend:

```txt
OK
```

Runtime backend:

```txt
MongoDB Atlas connected
PermissionsModule loaded
RolesModule loaded
UsersModule loaded
```

Health endpoint:

```txt
GET /health -> status ok
```

Endpoint danh sach:

```txt
GET /permissions -> []
GET /roles -> []
```

Danh sach rong la dung vi chua seed du lieu mac dinh.

## Viec can lam tiep theo

Buoc tiep theo nen la:

```txt
Step 02 - Seed permission, role, admin dau tien
```

Ly do:

- Chua co permission mac dinh nhu `chat:use`, `user:manage`, `blog:create`
- Chua co role `admin`
- Chua co role `member`
- Chua co tai khoan admin dau tien

Sau khi co seed, moi nen lam:

```txt
Auth register/login
```

## Can canh giac

Hien tai cac route user/role/permission chua co auth guard, nen ve sau phai dua cac route quan tri vao admin guard.

Tam thoi o phase nay chap nhan vi chua lam AuthModule.
