document.addEventListener("DOMContentLoaded", function() {
  // Handle Login
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
      loginForm.addEventListener("submit", function(event) {
          event.preventDefault();
          const email = document.getElementById("login-email").value;
          const password = document.getElementById("login-password").value;

          fetch('http://localhost:3001/signin', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                  email: email,
                  password: password
              })
          })
          .then(response => response.json())
          .then(data => {
              localStorage.setItem("token", data.token);
              window.location.href = "todo.html";
          })
          .catch(error => alert('Login failed'));
      });
  }

  // Handle Registration
  const registerForm = document.getElementById("register-form");
  if (registerForm) {
      registerForm.addEventListener("submit", function(event) {
          event.preventDefault();
          const name = document.getElementById("register-name").value;
          const email = document.getElementById("register-email").value;
          const password = document.getElementById("register-password").value;

          fetch('http://localhost:3001/signup', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                  email: email,
                  name: name,
                  password: password
              })
          })
          .then(response => response.json())
          .then(data => {
              window.location.href = "login.html";
          })
          .catch(error => alert('Registration failed'));
      });
  }

  // Handle Logout
  const logoutButton = document.getElementById("logout-btn");
  if (logoutButton) {
      logoutButton.addEventListener("click", function() {
          localStorage.removeItem("token");
          window.location.href = "login.html";
      });
  }
});
