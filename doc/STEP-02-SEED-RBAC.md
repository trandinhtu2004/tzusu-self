# Step 02 - Seed Permission, Role va Admin dau tien

Muc tieu:

- Tao danh sach permission mac dinh.
- Tao role `admin`.
- Tao role `member`.
- Tao tai khoan admin dau tien.
- Seed co the chay lai nhieu lan ma khong tao trung du lieu.

## File seed

Seed script nam o:

```txt
be-tzusu_self/src/seeds/seed.ts
```

Lenh chay:

```powershell
cd be-tzusu_self
pnpm seed
```

Lenh `pnpm seed` se:

```txt
1. build backend
2. chay dist/seeds/seed.js
3. doc bien trong .env
4. ket noi MongoDB Atlas
5. tao/update permission, role, admin
```

## Bien moi trong .env

Can them vao:

```env
SEED_ADMIN_EMAIL=your-email@example.com
SEED_ADMIN_USERNAME=admin
SEED_ADMIN_PASSWORD=your-strong-password
SEED_ADMIN_DISPLAY_NAME=Tzusu Admin
```

Khong commit `.env`.

`SEED_ADMIN_PASSWORD` la password thuong, seed se hash thanh `passwordHash` truoc khi luu vao MongoDB.

## Permission mac dinh

Seed se tao:

```txt
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
chat:request
chat:use
user:manage
role:manage
permission:manage
```

## Role mac dinh

Role `admin`:

```txt
co tat ca permission
```

Role `member`:

```txt
profile:view:registered
chat:request
```

Member mac dinh chua co `chat:use`. Admin se cap `chat:use` sau neu muon user nao duoc chat.

## Admin dau tien

Seed se tim admin theo:

```txt
SEED_ADMIN_EMAIL
```

Neu email chua ton tai:

```txt
tao user admin moi
```

Neu email da ton tai:

```txt
cap nhat username/displayName/role/status
khong doi password
```

Cach nay giup chay lai seed an toan, khong vo tinh reset password admin.

## Loi mong doi neu thieu env

Neu chua them bien admin, seed se dung ngay:

```txt
Missing required env: SEED_ADMIN_EMAIL
```

Day la dung. Hay them `SEED_ADMIN_*` vao `be-tzusu_self/.env` roi chay lai.

## Verify sau khi seed

Chay backend:

```powershell
pnpm start:dev
```

Kiem tra:

```txt
GET http://localhost:4000/permissions
GET http://localhost:4000/roles
```

Ket qua mong muon:

- `/permissions` tra ve danh sach permission.
- `/roles` tra ve `admin` va `member`.

## Buoc tiep theo

Sau khi seed xong:

```txt
Step 03 - Auth register/login/me
```

Luc do se chuyen `POST /users` thanh luong noi bo, frontend se dang ky qua:

```txt
POST /auth/register
```
