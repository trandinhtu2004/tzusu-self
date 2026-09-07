# Step 01 Add-on - DTO, Validation va Error Handling

Muc tieu:

- `POST /permissions`, `POST /roles`, `POST /users` co DTO ro rang.
- Input sai tra ve `400 Validation failed`.
- Tim user/role theo id khong thay tra ve `404 Not Found`.
- Tao trung unique field tra ve `409 Conflict`.

## Dependencies da them

Backend can:

```txt
class-validator
class-transformer
```

Hai package nay dung cho DTO validation trong NestJS.

## Global ValidationPipe

Da them vao:

```txt
src/main.ts
```

Pipe hien tai co:

```txt
whitelist: true
forbidNonWhitelisted: true
transform: true
```

Y nghia:

- Field khong nam trong DTO se bi chan.
- Field sai kieu/sai format tra ve `400`.
- Body duoc transform theo DTO class.

Response validation hien co dang:

```json
{
  "message": "Validation failed",
  "errors": ["name should not be empty"]
}
```

## DTO da tao

Permission:

```txt
src/modules/permissions/dto/create-permission.dto.ts
```

Role:

```txt
src/modules/roles/dto/create-role.dto.ts
src/modules/roles/dto/attach-permissions.dto.ts
```

User:

```txt
src/modules/users/dto/create-user.dto.ts
src/modules/users/dto/set-role.dto.ts
src/modules/users/dto/permission-id.dto.ts
```

## MongoIdPipe

Da tao:

```txt
src/common/pipes/mongo-id.pipe.ts
```

Dung de validate `:id` tren URL.

Vi du:

```txt
GET /roles/not-a-mongo-id
```

Se tra ve:

```json
{
  "message": "Validation failed",
  "errors": ["not-a-mongo-id is not a valid MongoDB ObjectId"]
}
```

## Error handling hien co

### 400 Validation failed

Khi body sai DTO hoac id sai format.

Vi du:

```txt
POST /permissions
Body: {}
```

Tra ve `400`.

### 404 Not Found

Khi id dung format MongoDB nhung document khong ton tai.

Vi du:

```txt
GET /users/000000000000000000000000
```

Tra ve:

```json
{
  "message": "User not found",
  "error": "Not Found",
  "statusCode": 404
}
```

### 409 Conflict

Khi tao trung field unique.

Vi du:

```txt
Permission name already exists
Role name already exists
Email or username already exists
```

## Luu y ve CreateUserDto

Hien tai `POST /users` van nhan:

```txt
passwordHash
```

Day chi la tam thoi trong phase RBAC base.

Khi sang `AuthModule`, frontend se khong gui `passwordHash` nua. Luc do flow dung se la:

```txt
POST /auth/register
Body: password
AuthService hash password
UsersService create user voi passwordHash
```

## Verify da chay

Build backend:

```txt
OK
```

Install backend:

```txt
OK
```

Test runtime tren port tam `4010`:

```txt
POST /permissions body {} -> 400 Validation failed
GET /users/000000000000000000000000 -> 404 User not found
GET /roles/not-a-mongo-id -> 400 Validation failed
```

## Buoc tiep theo

Sau buoc nay nen lam:

```txt
Seed permissions
Seed roles
Seed admin dau tien
```

Chua nen lam frontend login/register cho toi khi backend auth chay on.
