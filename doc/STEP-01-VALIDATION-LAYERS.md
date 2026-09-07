# Step 01 Note - Validation Layers

Muc tieu cua note nay la thong nhat ranh gioi giua Controller, DTO, Service va Repository.

## Ket luan ngan

Y kien cua ban la dung:

```txt
DTO/Controller: validate input shape
Service: validate nghiep vu
Repository: thao tac database, khong nen quyet dinh HTTP response
Database schema/index: bao ve data integrity tang cuoi
```

## Nen validate o dau?

### 1. DTO / Controller

Dung cho validation dau vao:

```txt
email co dung format khong
name co rong khong
id co dung Mongo ObjectId khong
permissionIds co phai array ObjectId khong
field la string/array/enum hay khong
```

Vi du:

```txt
CreateUserDto
CreateRoleDto
CreatePermissionDto
MongoIdPipe
ValidationPipe
```

Loi o tang nay nen tra:

```txt
400 Bad Request
```

### 2. Service

Dung cho validation nghiep vu:

```txt
user co ton tai khong
role co ton tai khong
permission co ton tai khong
email/username da duoc dung chua
member co duoc gan role admin khong
user banned co duoc login khong
admin co duoc tu xoa quyen admin cua minh khong
user da co chat:use chua
```

Loi o tang nay nen tra:

```txt
404 Not Found
409 Conflict
403 Forbidden
401 Unauthorized
```

### 3. Repository

Repository nen lam viec gon:

```txt
find
findOne
create
update
delete
populate
transaction
```

Repository nen tra:

```txt
document
null
array
```

Repository khong nen tu quyet:

```txt
throw new NotFoundException(...)
throw new ConflictException(...)
throw new BadRequestException(...)
```

Ly do:

- Repository la tang persistence, khong nen biet HTTP.
- Mot repository co the duoc dung boi REST API, seed script, worker BullMQ, websocket, hoac CLI.
- Neu repo nem HTTP exception, logic nghiep vu bi roi xuong tang database.

## Trang thai code hien tai

Trang thai sau refactor:

```txt
404 Not Found: nam o service cho role/user va permission references
400 Validation failed: da nam o DTO/Pipe
409 Conflict: da duoc dua len service cho create permission/role/user
500 InternalServerError: van nam trong repository
```

Nghia la duplicate email/name se duoc chan o service truoc khi tao document moi.

## Huong refactor nen lam

Nen chuyen unique check tu repository len service.

Vi du thay vi:

```txt
Repository create -> bat duplicate key -> throw ConflictException
```

Nen la:

```txt
Service create -> findByName/findByEmail truoc
Neu da ton tai -> throw ConflictException
Neu chua -> repository.create
```

Repository van co the de MongoDB unique index lam lop bao ve cuoi cung, nhung service moi la noi tra loi nghiep vu cho client.

## Vi du flow create permission

Dung:

```txt
Controller nhan CreatePermissionDto
Service kiem tra findByName(name)
Neu co -> 409 Permission name already exists
Neu chua -> Repository create
Repository chi luu DB va tra document
```

Khong nen:

```txt
Repository tu bat duplicate key va throw ConflictException
```

## Vi du flow attach permission vao role

Dung:

```txt
Controller validate roleId va permissionIds
Service kiem tra role co ton tai khong
Service kiem tra tat ca permissionIds co ton tai khong
Neu role khong co -> 404 Role not found
Neu permission khong co -> 404 Permission not found
Repository update role
```

Hien tai code moi chi check role co ton tai sau update. Sau nay nen check permissionIds nua.

## Muc tieu refactor gan

Da lam:

```txt
1. PermissionService createPermission check duplicate bang findByName
2. RoleService createRole check duplicate bang findByName
3. UsersService createUser check duplicate bang findByEmail/findByUsername
4. Repository bo ConflictException
5. Service bat duplicate key error nhu lop bao ve cuoi cung
```

Option sach hon nua:

```txt
Repository khong throw HTTP exception nao
De global exception filter xu ly loi database ve sau
```

Nhung hien tai chua can di qua sau. Lam tung buoc la on.

## Verify duplicate user

Case:

```txt
POST /users voi email da ton tai
```

Ket qua:

```json
{
  "message": "Email already exists",
  "error": "Conflict",
  "statusCode": 409
}
```
