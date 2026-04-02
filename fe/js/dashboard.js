const API = "http://localhost:3000/api/users";

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  };
}

// 1. Tải danh sách user
async function loadUsers() {
  try {
    const res = await fetch(API, {
      method: "GET",
      headers: getAuthHeaders() 
    });

    if (!res.ok) throw new Error("Lỗi: " + res.status);

    const users = await res.json();
    const table = document.getElementById("userTable");
    table.innerHTML = "";

    // LẤY THÔNG TIN USER ĐANG ĐĂNG NHẬP (từ lúc login lưu vào)
    const currentUser = JSON.parse(localStorage.getItem("user"));

    users.forEach(u => {
      // KIỂM TRA: Dòng hiện tại có phải là tài khoản đang đăng nhập không?
      const isCurrentUser = currentUser && currentUser.id === u.id;

      // Xử lý nút Xóa: Nếu là user đang đăng nhập thì Disable (làm mờ đi), ngược lại cho phép bấm
      const deleteBtn = isCurrentUser 
        ? `<button disabled style="background-color: #ccc; cursor: not-allowed;" title="Không thể xóa chính mình">Delete</button>`
        : `<button onclick="deleteUser(${u.id})">Delete</button>`;

      // Xử lý nút Sửa (Cho phép sửa tất cả, kể cả chính mình)
      const editBtn = `<button onclick="editUser(${u.id}, '${u.username}')">Edit</button>`;

      table.innerHTML += `
      <tr>
        <td>${u.id}</td>
        <td>${u.username}</td>
        <td>******</td>
        <td>
          ${editBtn}
          ${deleteBtn}
        </td>
      </tr>
      `;
    });
  } catch (error) {
    console.log(error);
  }
}

// 2. Thêm user
async function addUser() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  await fetch(API, {
    method: "POST",
    headers: getAuthHeaders(), 
    body: JSON.stringify({ username, password })
  });

  loadUsers();
}

// 3. Xóa user
async function deleteUser(id) {
  await fetch(`${API}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders() 
  });

  loadUsers();
}

// 4. Đăng xuất
function logout() {
  localStorage.removeItem("user");
  localStorage.removeItem("token"); 
  window.location.href = "login.html";
}

// 5.Edit User
// Cập nhật hàm Edit User để sửa cả mật khẩu
async function editUser(id, currentUsername) {
  // 1. Hỏi Username mới (Hiển thị sẵn tên cũ, nếu xóa trắng thì lấy lại tên cũ)
  let newUsername = prompt("Nhập Username mới:", currentUsername);
  
  // Nếu bấm Cancel (Hủy) ở ô Username thì dừng luôn
  if (newUsername === null) return; 
  
  // Nếu lỡ xóa trắng thì mặc định giữ lại tên cũ
  if (newUsername.trim() === "") {
      newUsername = currentUsername;
  }

  // 2. Hỏi Password mới (Để trống nếu không muốn đổi)
  const newPassword = prompt("Nhập Password mới:\n(Để trống nếu muốn giữ nguyên mật khẩu cũ)");
  
  // Nếu bấm Cancel (Hủy) ở ô Password thì dừng luôn
  if (newPassword === null) return;

  // Kiểm tra xem có gì thay đổi không? Nếu không đổi gì thì không cần gọi API cho đỡ tốn tài nguyên
  if (newUsername === currentUsername && newPassword.trim() === "") {
      alert("Bạn chưa thay đổi thông tin gì.");
      return; 
  }

  // Gói dữ liệu để gửi xuống Backend
  const updateData = { 
      username: newUsername, 
      password: newPassword 
  };

  try {
    const res = await fetch(`${API}/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(), // Nhớ dùng getAuthHeaders() để có Token
      body: JSON.stringify(updateData)
    });

    if (!res.ok) throw new Error("Lỗi Server");

    alert("Cập nhật thành công!");
    
    // Tải lại bảng sau khi sửa
    loadUsers();
  } catch (error) {
    console.error("Lỗi khi sửa:", error);
    alert("Có lỗi xảy ra khi cập nhật!");
  }
}

// Chạy lần đầu khi load trang
loadUsers();