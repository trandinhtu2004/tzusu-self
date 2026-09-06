# Roadmap Du An Personal Portfolio + Realtime Chat

## Muc Tieu

Xay dung mot he thong ca nhan gom:

- Trang gioi thieu ban than / portfolio.
- Khu trung bay cac website va du an da lam.
- He thong dang ky, dang nhap.
- Chat realtime la tinh nang chinh.
- Co Docker de chay local va deploy.
- Co kha nang deploy len domain rieng, dung Cloudflare/DNS/CDN/SSL.

## Kien Truc Tong Quan

```txt
User
  |
  v
Cloudflare DNS/CDN/SSL
  |
  +--> your-domain.com        -> NextJS frontend
  +--> api.your-domain.com    -> NestJS backend + WebSocket
                                 |
                                 v
                              MongoDB Atlas
```

## Stack De Xuat

### Frontend

- NextJS App Router
- TypeScript
- TailwindCSS
- shadcn/ui neu muon lam UI dep nhanh
- Socket.IO client cho chat realtime

### Backend

- NestJS
- TypeScript
- MongoDB + Mongoose
- Socket.IO Gateway
- JWT access token + refresh token
- bcrypt hoac argon2 de hash password

### Database

- MongoDB Atlas Free Cluster de bat dau
- Cac collection nen co:
  - `users`
  - `conversations`
  - `conversation_members`
  - `messages`
  - `refresh_tokens`

### DevOps / Deploy

- Docker
- Docker Compose
- Cloudflare DNS
- Caddy hoac Nginx khi tu deploy tren VPS
- Vercel / Cloudflare Pages cho frontend giai doan dau
- Render / Koyeb / Oracle Cloud Always Free cho backend giai doan dau

## Cau Truc Thu Muc De Xuat

```txt
apps/
  web/
    # NextJS frontend
  api/
    # NestJS backend

packages/
  shared/
    # Type, DTO, validation schema dung chung neu can

docker-compose.yml
.env.example
README.md
ROADMAP.md
```

## Cac Tinh Nang Nen Lam Theo Thu Tu

## Giai Doan 1: Khoi Tao Nen Mong

- Tao GitHub repo.
- Khoi tao monorepo bang `pnpm`.
- Tao app NextJS trong `apps/web`.
- Tao app NestJS trong `apps/api`.
- Them TypeScript, lint, format.
- Tao `.env.example`.
- Tao Dockerfile cho frontend va backend.
- Tao `docker-compose.yml` de chay local.

Ket qua mong muon:

- Chay duoc frontend local.
- Chay duoc backend local.
- Backend co endpoint health check, vi du: `GET /health`.

## Giai Doan 2: MongoDB Atlas

- Tao tai khoan MongoDB Atlas.
- Tao Free Cluster.
- Tao database user.
- Lay connection string.
- Them `MONGODB_URI` vao `.env`.
- Ket noi NestJS voi MongoDB bang Mongoose.

Luu y:

- Khong commit `.env` len GitHub.
- Chi commit `.env.example`.
- Giai doan dau co the allow IP tam thoi, sau nay nen gioi han lai theo server deploy.

## Giai Doan 3: Auth

Lam cac tinh nang:

- Register.
- Login.
- Logout.
- Refresh token.
- Lay thong tin user hien tai.
- Guard bao ve API.

Bang du lieu user nen co:

```ts
{
  email: string;
  username: string;
  passwordHash: string;
  avatarUrl?: string;
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

## Giai Doan 4: Chat Realtime

Backend NestJS nen co:

- `AuthModule`
- `UsersModule`
- `ConversationsModule`
- `MessagesModule`
- `ChatGateway`

Flow gui tin nhan:

```txt
1. User dang nhap tren frontend.
2. Frontend connect Socket.IO voi JWT.
3. User gui message.
4. Backend validate user.
5. Backend luu message vao MongoDB.
6. Backend emit message moi den cac user trong conversation.
7. Frontend cap nhat UI realtime.
```

Tinh nang chat nen lam theo thu tu:

- Chat 1-1.
- Danh sach conversation.
- Gui va nhan message realtime.
- Luu lich su message.
- Typing indicator.
- Online/offline status.
- Seen/read receipt.
- Upload avatar.
- Upload anh trong chat.
- Group chat.
- Search message.

## Giai Doan 5: Portfolio Va Trang Gioi Thieu

Route de xuat:

```txt
/                 -> Trang gioi thieu ban than
/projects         -> Danh sach du an
/projects/[slug]  -> Chi tiet tung du an
/blog             -> Bai viet / ghi chu hoc tap
/chat             -> Ung dung chat
/dashboard        -> Khu quan tri ca nhan
```

Noi dung nen co:

- Gioi thieu ngan ve ban than.
- Ky nang chinh.
- Cac project noi bat.
- Link GitHub, LinkedIn, CV.
- Demo cac app da lam.
- Chat app nhu mot san pham thuc te.

## Giai Doan 6: Docker

Local development:

```txt
docker-compose.yml
  web
  api
```

Production VPS:

```txt
docker-compose.yml
  web
  api
  caddy hoac nginx
```

Khuyen nghi:

- Production van dung MongoDB Atlas, khong tu host MongoDB luc dau.
- Khong luu file upload truc tiep len filesystem neu dung hosting free vi filesystem co the bi xoa khi redeploy/restart.

## Giai Doan 7: Deploy Mien Phi / Gan Mien Phi

Lua chon de bat dau nhanh:

```txt
Frontend: Vercel hoac Cloudflare Pages
Backend: Render Free hoac Koyeb Free
Database: MongoDB Atlas Free
DNS/SSL/CDN: Cloudflare Free
Domain: Mua domain rieng
```

Lua chon hoc server that:

```txt
Server: Oracle Cloud Always Free
Reverse proxy: Caddy hoac Nginx
Runtime: Docker Compose
Database: MongoDB Atlas
DNS: Cloudflare
```

## Cloudflare, Nginx, Caddy Nen Hieu The Nao

### Cloudflare

Dung de:

- Quan ly DNS.
- Bat SSL.
- CDN cho file tinh.
- Bao ve DDoS co ban.
- An IP server neu cau hinh dung.
- Co the dung Cloudflare Tunnel neu khong muon mo port truc tiep.

### Nginx

Dung de:

- Reverse proxy.
- Route domain/subdomain ve frontend/backend.
- Xu ly SSL neu ket hop Let's Encrypt.
- Phu hop production nhung config can can than hon.

### Caddy

Dung de:

- Reverse proxy giong Nginx.
- Tu dong cap HTTPS.
- Config don gian hon Nginx.

Neu moi tu deploy VPS, nen uu tien Caddy.

## Goi Y Domain

Nen mua domain that thay vi dung domain free kem on dinh.

Goi y:

- `.com`
- `.dev`
- `.me`
- `.app`

Noi mua:

- Cloudflare Registrar
- Porkbun
- Namecheap

Sau khi mua:

```txt
1. Tro nameserver ve Cloudflare.
2. Tao DNS record cho frontend.
3. Tao DNS record cho backend.
4. Bat SSL/TLS tren Cloudflare.
```

Vi du DNS:

```txt
A/CNAME  @    -> frontend hosting
CNAME    www  -> frontend hosting
CNAME    api  -> backend hosting
```

## Bien Moi Truong Can Co

Backend:

```env
NODE_ENV=development
PORT=4000
MONGODB_URI=
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
CLIENT_URL=http://localhost:3000
```

Frontend:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_SOCKET_URL=http://localhost:4000
```

## Checklist Bat Dau

- [ ] Tao monorepo.
- [ ] Tao NextJS app.
- [ ] Tao NestJS app.
- [ ] Tao MongoDB Atlas Free Cluster.
- [ ] Ket noi NestJS voi MongoDB.
- [ ] Tao schema User.
- [ ] Lam register.
- [ ] Lam login.
- [ ] Lam refresh token.
- [ ] Tao Socket.IO Gateway.
- [ ] Lam chat 1-1.
- [ ] Luu message vao MongoDB.
- [ ] Lam UI danh sach conversation.
- [ ] Lam UI chat.
- [ ] Docker hoa frontend/backend.
- [ ] Deploy frontend.
- [ ] Deploy backend.
- [ ] Mua domain.
- [ ] Cau hinh Cloudflare.
- [ ] Tro `api.your-domain.com` ve backend.
- [ ] Tro `your-domain.com` ve frontend.

## Thu Tu Uu Tien Nen Theo

1. Lam app chay local truoc.
2. Lam auth on dinh.
3. Lam chat 1-1 realtime.
4. Lam UI portfolio.
5. Docker hoa.
6. Deploy free.
7. Mua domain va gan Cloudflare.
8. Sau khi on dinh moi chuyen sang VPS rieng.

## Quyet Dinh Hien Tai

Khuyen nghi bat dau voi:

```txt
NextJS + NestJS + MongoDB Atlas + Socket.IO + Docker
```

Deploy ban dau:

```txt
Frontend: Vercel
Backend: Render Free hoac Koyeb Free
Database: MongoDB Atlas Free
DNS: Cloudflare Free
```

Khi can hoc production/server:

```txt
Oracle Cloud Always Free + Docker Compose + Caddy + Cloudflare + MongoDB Atlas
```

