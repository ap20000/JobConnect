document
  .getElementById("registerForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevent default form submission

    const name = document.getElementById("name").value;
    const userName = document.getElementById("userName").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const response = await axios.post("/userAuth/register", {
        name,
        userName,
        email,
        password,
      });
      console.log("Registration Response:", response.data);
      alert("Registration successful", response.data);

      document.getElementById("registerForm").reset();
      window.location.href = "/login.html";
    } catch (error) {
      console.error("Registration Error:", error);
      alert("Registration failed");
    }
  });
