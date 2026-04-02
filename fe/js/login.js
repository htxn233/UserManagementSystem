async function login(event) {
  event.preventDefault(); 
  
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const res = await fetch("http://localhost:3000/api/auth/login", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();

  if (data.success) {
    // Lưu thông tin user (như cũ)
    localStorage.setItem("user", JSON.stringify(data.user));
    
    // THÊM DÒNG NÀY: Lưu token vào trình duyệt
    localStorage.setItem("token", data.token); 
    
    window.location.href = "dashboard.html";
  } else {
    alert("Sai tài khoản hoặc mật khẩu");
  }
}