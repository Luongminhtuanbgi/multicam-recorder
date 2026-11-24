# Multi-Cam Recorder

Ứng dụng thu thập dữ liệu video đồng bộ từ nhiều góc quay qua mạng LAN (Bài tập lớn học phần IT4409).

Hệ thống gồm hai vai trò chính:

- **Controller (Web trên PC/Laptop):** Tạo phòng, quản lý các thiết bị kết nối, ra lệnh bắt đầu/dừng quay đồng thời và quản lý thư viện video thu được trên máy chủ.
- **Remote (Android):** Tham gia phòng qua mã mời 6 ký tự, ghi hình MP4 cục bộ theo lệnh điều khiển và tự động tải video lên máy chủ theo từng phần (chunk upload).

## Công nghệ sử dụng

- **Monorepo (`npm workspaces`):**
  - `shared/`: Bảng mã phản hồi, câu thông báo tiếng Việt, schema Zod và kiểu dữ liệu dùng chung.
  - `backend/`: Node.js, TypeScript, Express, Prisma ORM, PostgreSQL, Vitest + Supertest.
  - `app/`: React Native + Expo Router (TypeScript), chạy chung trên Web (`react-native-web`) và Android.

## Hướng dẫn cài đặt & chạy thử

### 1. Yêu cầu môi trường

- Node.js `>= 20` (khuyến nghị `v22 LTS`) + npm
- PostgreSQL `>= 16` chạy local (tạo 2 database `multicam_dev` và `multicam_test`)
- Android SDK + JDK 17 (nếu build lên máy Android thật)

### 2. Cài đặt gói phụ thuộc

```bash
npm install
npm run build:shared
```

### 3. Cấu hình biến môi trường & Database

Sao chép file cấu hình mẫu cho `backend` và `app`:

```bash
cp backend/.env.example backend/.env
cp backend/.env.example backend/.env.test
cp app/.env.example app/.env
```

_(Trong `backend/.env.test`, chỉnh tên database trong `DATABASE_URL` thành `multicam_test`)._

Chạy migration và khởi tạo tài khoản Controller mặc định:

```bash
npm --workspace=backend run db:migrate
npm --workspace=backend run db:seed
npm --workspace=backend run db:migrate:test
```

### 4. Khởi chạy phát triển

```bash
# Chạy Backend API (cổng 3000)
npm run dev:backend

# Chạy giao diện Web Controller
npm run dev:web

# Build và chạy trên thiết bị Android
npm run dev:android
```

### 5. Kiểm tra mã nguồn & chạy test

```bash
npm run lint
npm run typecheck
npm run test:backend
```
