# Phase 2 - User, Role, Permission va Auth

Muc tieu cua phase nay la bien backend tu app co ket noi MongoDB thanh app co nen mong user/phan quyen ro rang.

Trang cua minh se la public blog + portfolio + showcase project. Chat la tinh nang phu, chi user nao duoc admin cap quyen moi dung duoc.

## Trang thai hien tai

Ban da tao entity/model cho 3 nhom:

- `permission`
- `role`
- `user`

Huong tiep theo khong nen nhay vao login/register ngay. Nen hoan thien nen mong RBAC truoc, vi auth va chat permission se dua tren no.

## Dieu can sua som

Hien tai folder role dang co typo:

```txt
src/modules/roles/enitities/role.ts
```

Nen doi thanh:

```txt
src/modules/roles/entities/role.ts
```

Ten file schema hien tai dang la:

```txt
permission.ts
role.ts
user.ts
```

Voi NestJS + Mongoose, nen dat ro hon:

```txt
permission.schema.ts
role.schema.ts
user.schema.ts
```

Khong bat buoc sua ngay, nhung nen sua truoc khi code lon de project sach.

## Thiet ke quyen nen dung

Permission nen la cac chuoi co y nghia hanh dong.

Goi y permission ban dau:

```txt
profile:view:private
profile:manage
blog:create
blog:update
blog:delete
blog:publish
project:create
project:update
project:delete
chat:request
chat:use
user:manage
role:manage
permission:manage
```

Role ban dau:

```txt
admin
member
guest
```

Trong do:

```txt
admin:
  - tat ca permission

member:
  - profile:view:private neu admin cho phep
  - chat:request

guest:
  - khong can luu trong database, chi la nguoi chua login
```

User nen co:

```txt
role
grantedPermissions
deniedPermissions
status
```

Quy tac check quyen nen la:

```txt
1. Neu user bi banned -> tu choi
2. Neu deniedPermissions co permission do -> tu choi
3. Neu grantedPermissions co permission do -> cho phep
4. Neu role co permission do -> cho phep
5. Con lai -> tu choi
```

Cach nay giup admin co the cap rieng quyen chat cho 1 user ma khong can tao role moi.

## Thu tu lam tiep theo

### Buoc 1 - Hoan thien modules

Can co day du module/service/controller cho:

```txt
src/modules/permissions
src/modules/roles
src/modules/users
```

Moi module nen import schema cua no bang `MongooseModule.forFeature`.

Ket qua mong muon:

```txt
PermissionsModule dang ky PermissionSchema
RolesModule dang ky RoleSchema
UsersModule dang ky UserSchema
```

Sau buoc nay, app build duoc va khong co loi import.

### Buoc 2 - Viet service co ban

PermissionsService can co:

```txt
findAll()
findByName(name)
create(data)
```

RolesService can co:

```txt
findAll()
findByName(name)
create(data)
attachPermissions(roleId, permissionIds)
```

UsersService can co:

```txt
findById(id)
findByEmail(email)
findByUsername(username)
create(data)
setRole(userId, roleId)
grantPermission(userId, permissionId)
denyPermission(userId, permissionId)
```

Chua can viet controller phuc tap ngay. Service dung truoc cho auth va admin sau nay.

### Buoc 3 - Seed du lieu mac dinh

Ban can co seed script de tao:

- danh sach permission mac dinh
- role `admin`
- role `member`
- tai khoan admin dau tien

Vi app cua ban co admin duyet chat va dieu khien noi dung hien thi, seed admin dau tien la bat buoc.

Khuyen nghi:

```txt
pnpm seed
```

Script nay chi chay khi can, khong tu dong chay moi lan start backend.

### Buoc 4 - Lam AuthModule

Sau khi user/role/permission service on, moi tao auth:

```txt
src/modules/auth
```

Auth can co:

```txt
register
login
me
refresh token
logout
```

Register ban dau nen tao user voi:

```txt
status = pending
role = member
chat permission = chua co
```

Nghia la user dang ky xong co the login, nhung chua chat duoc neu admin chua cap `chat:use`.

### Buoc 5 - Them guard phan quyen

Can co:

```txt
JwtAuthGuard
RolesGuard
PermissionsGuard
```

Dung decorator:

```txt
@RequirePermissions('chat:use')
@RequirePermissions('blog:create')
@RequirePermissions('profile:manage')
```

Sau nay route chat se can:

```txt
@RequirePermissions('chat:use')
```

## API nen co trong phase nay

Public:

```txt
POST /auth/register
POST /auth/login
POST /auth/refresh
```

Logged in:

```txt
GET /auth/me
POST /auth/logout
POST /chat-access/request
```

Admin:

```txt
GET /admin/users
PATCH /admin/users/:id/status
PATCH /admin/users/:id/role
POST /admin/users/:id/permissions/grant
POST /admin/users/:id/permissions/deny
```

## Dieu kien hoan thanh phase 2

Phase 2 duoc xem la xong khi:

- Backend ket noi MongoDB Atlas thanh cong
- Co User schema, Role schema, Permission schema
- Co seed admin dau tien
- Dang ky user moi duoc
- Login tra ve access token
- `GET /auth/me` tra ve thong tin user dang login
- Admin co the cap quyen `chat:use` cho user
- User khong co `chat:use` bi chan khi vao chat API

## Viec nen lam ngay sau file nay

1. Sua typo `enitities` thanh `entities`.
2. Doi ten schema file cho ro rang neu ban muon project sach.
3. Tao module/service/controller cho `permissions` va `roles`.
4. Hoan thien `UsersModule` bang `MongooseModule.forFeature`.
5. Viet service basic cho 3 module.
6. Build backend.
7. Commit voi message:

```txt
Add RBAC base models and services
```

## Luu y Git

Root dang co file zip lon:

```txt
MSIAfterburnerSetup.zip
```

Khong nen commit file nay vao repo. Hay xoa khoi folder project hoac them rule ignore cho file `*.zip`.
