const API = "http://localhost:3000/api/users";

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  };
}

// 1. Load users list
async function loadUsers() {
  try {
    const res = await fetch(API, {
      method: "GET",
      headers: getAuthHeaders() 
    });

    if (!res.ok) throw new Error("Error: " + res.status);

    const users = await res.json();
    const table = document.getElementById("userTable");
    table.innerHTML = "";

    // Get current logged-in user info (saved in localStorage at login time)
    const currentUser = JSON.parse(localStorage.getItem("user"));

    users.forEach(u => {
      // CHECK: Is the current row the logged-in user?
      const isCurrentUser = currentUser && currentUser.id === u.id;

      // Handle Delete button: If it's the logged-in user, disable (fade out), otherwise allow clicking
      const deleteBtn = isCurrentUser 
        ? `<button disabled style="background-color: #ccc; cursor: not-allowed;" title="Cannot delete your own account">Delete</button>`
        : `<button onclick="deleteUser(${u.id})">Delete</button>`;

      // Handle Edit button (allow editing all users, including the logged-in user)
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

// 2. Add a user
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

// 3. Delete user
async function deleteUser(id) {
  await fetch(`${API}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders() 
  });

  loadUsers();
}

// 4. Logout
function logout() {
  localStorage.removeItem("user");
  localStorage.removeItem("token"); 
  window.location.href = "login.html";
}

// 5. Edit User
// Update Edit User function to handle both username and password changes
async function editUser(id, currentUsername) {
  // 1. Ask for new Username (Pre-fill with current username, if left blank then keep the old username)
  let newUsername = prompt("Enter new Username:", currentUsername);
  
  // If user clicks Cancel in the Username prompt, stop the process immediately
  if (newUsername === null) return; 
  
  // If user leaves the Username field empty, keep the current username
  if (newUsername.trim() === "") {
      newUsername = currentUsername;
  }

  // 2. Ask for new Password (Leave blank if you don't want to change it)
  const newPassword = prompt("Enter new Password:\n(Leave blank if you want to keep the current password)");
  
  // If user clicks Cancel in the Password prompt, stop the process immediately
  if (newPassword === null) return;

  // Check if there is any change at all. If not, no need to call API to save resources
  if (newUsername === currentUsername && newPassword.trim() === "") {
      alert("You haven't changed any information.");
      return; 
  }

  // Pack the data to send to Backend
  const updateData = { 
      username: newUsername, 
      password: newPassword 
  };

  try {
    const res = await fetch(`${API}/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(), // Remember to use getAuthHeaders() to include the Token
      body: JSON.stringify(updateData)
    });

    if (!res.ok) throw new Error("Server Error");

    alert("Update successful!");
    
    // Reload the table after editing
    loadUsers();
  } catch (error) {
    console.error("Error updating user:", error);
    alert("An error occurred while updating the user!");
  }
}

// Run this function once when the page loads
loadUsers();