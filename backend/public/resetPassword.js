document
  .getElementById("resetForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const userName = document.getElementById("userName").value;
    const oldpassword = document.getElementById("oldpassword").value;
    const newPassword = document.getElementById("newPassword").value;

    try {
      const response = await axios.post("/userAuth/reset", {
        userName,
        oldpassword,
        newPassword,
      });
      console.log("Change Password", response.data);
      alert("Password reset successful");
      window.location.href = "/login.html";
    } catch (error) {
      console.error("Change Password error:", error);
      alert("Failed to change password");
    }
  });