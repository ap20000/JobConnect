document
  .getElementById("loginForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const userName = document.getElementById("userName").value;
    const password = document.getElementById("password").value;

    try {
      const response = await axios.post("/userAuth/login", {
        userName,
        password,
      });
      console.log("Login successful", response.data);
      alert("Login Successful");
      window.location.href = "/userTable.html";
    } catch (error) {
      console.error("Login Error:", error);
      alert("Login failed");
    }
  });