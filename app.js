const apiUrl = "https://jsonplaceholder.typicode.com/users";
const userTable = document.getElementById("userTable").querySelector("tbody");
const userFormContainer = document.getElementById("userFormContainer");
const formTitle = document.getElementById("formTitle");
const errorMessage = document.getElementById("errorMessage");

let users = []; // Local array to hold user data

// Fetch and display users
async function fetchUsers() {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error("Failed to fetch users.");
    const data = await response.json();
    users = data; // Store fetched data in the local array
    renderUsers(users);
  } catch (error) {
    showError(error.message);
  }
}

// Render users in the table
function renderUsers(users) {
  userTable.innerHTML = "";
  users.forEach((user) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${user.id}</td>
      <td>${user.name.split(" ")[0]}</td>
      <td>${user.name.split(" ")[1] || ""}</td>
      <td>${user.email}</td>
      <td>${user.company?.name || "N/A"}</td>
      <td>
        <button onclick="showEditUserForm(${user.id})">Edit</button>
        <button onclick="deleteUser(${user.id})">Delete</button>
      </td>
    `;
    userTable.appendChild(row);
  });
}

// Show the form for adding a user
function showAddUserForm() {
  formTitle.innerText = "Add User";
  userFormContainer.style.display = "block";
  clearForm();
}

// Show the form for editing a user
function showEditUserForm(id) {
  const user = users.find((u) => u.id === id);
  if (!user) return;

  formTitle.innerText = "Edit User";
  userFormContainer.style.display = "block";

  const [firstName, lastName] = user.name.split(" ");
  document.getElementById("userId").value = user.id;
  document.getElementById("firstName").value = firstName || "";
  document.getElementById("lastName").value = lastName || "";
  document.getElementById("email").value = user.email;
  document.getElementById("department").value = user.company?.name || "";
}

// Handle form submission
function handleSubmit(event) {
  event.preventDefault();

  const id = document.getElementById("userId").value;
  const firstName = document.getElementById("firstName").value;
  const lastName = document.getElementById("lastName").value;
  const email = document.getElementById("email").value;
  const department = document.getElementById("department").value;

  const userData = {
    id: id || Date.now(), // Generate a temporary ID for new users
    name: `${firstName} ${lastName}`,
    email,
    company: { name: department },
  };

  if (id) {
    // Edit existing user
    const userIndex = users.findIndex((u) => u.id === parseInt(id));
    if (userIndex > -1) {
      users[userIndex] = userData;
    }
  } else {
    // Add new user
    users.push(userData);
  }

  renderUsers(users); // Re-render the user list
  hideForm();
}

// Delete a user
function deleteUser(id) {
  users = users.filter((user) => user.id !== id);
  renderUsers(users);
}

// Hide the form
function hideForm() {
  userFormContainer.style.display = "none";
  clearForm();
  errorMessage.innerText = "";
}

// Clear the form fields
function clearForm() {
  document.getElementById("userId").value = "";
  document.getElementById("firstName").value = "";
  document.getElementById("lastName").value = "";
  document.getElementById("email").value = "";
  document.getElementById("department").value = "";
}

// Show error message
function showError(message) {
  errorMessage.innerText = message;
}

// Initialize the app
fetchUsers();
