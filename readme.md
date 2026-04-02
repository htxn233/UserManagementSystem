# 👥 User Management System

Dự án ứng dụng web quản lý người dùng cơ bản với kiến trúc Client-Server. Ứng dụng cho phép xác thực người dùng an toàn và thực hiện các thao tác quản lý dữ liệu (CRUD).

## 🚀 Tính năng chính

- **Xác thực người dùng (Authentication):** Đăng nhập an toàn sử dụng JSON Web Token (JWT). Bảo vệ các API bằng Middleware.
- **Quản lý danh sách (Read):** Hiển thị danh sách người dùng trên bảng Dashboard.
- **Thêm người dùng (Create):** Thêm tài khoản mới trực tiếp từ giao diện.
- **Sửa thông tin (Update):** Cho phép thay đổi Username và Password. Tự động nhận diện nếu người dùng chỉ muốn đổi tên mà giữ nguyên mật khẩu.
- **Xóa người dùng (Delete):** Xóa tài khoản khỏi hệ thống (Tích hợp logic bảo vệ: Không cho phép người dùng tự xóa tài khoản đang đăng nhập).
- **Đăng xuất (Logout):** Xóa token và phiên đăng nhập an toàn.

## 🛠️ Công nghệ sử dụng

- **Frontend:** HTML5, CSS3, JavaScript.
- **Backend:** Node.js, Express.js.
- **Database:** MySQL.
- **Bảo mật:** `jsonwebtoken` (JWT) để cấp quyền truy cập API.

## 📂 Cấu trúc thư mục

```text
TMA/
├── be/                       # Thư mục Backend
│   ├── middleware/
│   │   └── authMiddleware.js # Kiểm tra token hợp lệ
│   ├── routes/
│   │   ├── auth.js           # API Đăng nhập
│   │   └── users.js          # Các API CRUD (Get, Post, Put, Delete)
│   ├── db.js                 # Cấu hình kết nối MySQL
│   └── server.js             # Điểm khởi chạy server Express
├── fe/                       # Thư mục Frontend
│   ├── css/                  # Chứa các file giao diện
│   ├── js/                   # Xử lý logic gọi API (dashboard.js, login.js)
│   ├── dashboard.html
│   └── login.html
├── package.json
└── README.md
```

⚙️ Hướng dẫn cài đặt và chạy dự án

1. Yêu cầu hệ thống
Máy tính đã cài đặt Node.js.

Máy tính đã cài đặt XAMPP (hoặc MySQL Server tương đương).

2. Thiết lập Cơ sở dữ liệu (Database)
Mở XAMPP, khởi động Apache và MySQL.

Truy cập http://localhost/phpmyadmin/.

Tạo database mới với tên: user_management.

Mở tab SQL và chạy đoạn mã sau để tạo bảng và thêm tài khoản mẫu:

SQL
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);
INSERT INTO users (username, password) VALUES ('admin', '12345');

3. Cài đặt và Khởi chạy
Clone dự án về máy hoặc giải nén mã nguồn.

Mở Terminal (Command Prompt) tại thư mục gốc của dự án.

Cài đặt các thư viện cần thiết:

Bash
npm install
Kiểm tra file be/db.js để đảm bảo thông tin đăng nhập MySQL là chính xác (thường XAMPP có user là root và password để trống).

Khởi chạy server:

Bash
node be/server.js
Mở trình duyệt và truy cập: http://localhost:3000

Đăng nhập bằng tài khoản mẫu:

Username: admin

Password: 12345
