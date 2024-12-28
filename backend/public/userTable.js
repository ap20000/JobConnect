document.addEventListener("DOMContentLoaded", async () => {
    try {
      const response = await axios.get("/userAuth/users");
      const users = response.data;
  
      const tbody = document.querySelector("#usersTable tbody");
      tbody.innerHTML = "";
  
      users.forEach((user) => {
        const row = document.createElement("tr");
  
        const nameCell = document.createElement("td");
        nameCell.textContent = user.name;
        row.appendChild(nameCell);
  
        const userNameCell = document.createElement("td");
        userNameCell.textContent = user.userName;
        row.appendChild(userNameCell);
  
        const emailCell = document.createElement("td");
        emailCell.textContent = user.email;
        row.appendChild(emailCell);
  
        tbody.appendChild(row);
      });
    } catch (error) {
      console.error("Failed to fetch users", error);
      alert("Failed to load user");
    }
  });