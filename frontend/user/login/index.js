function showForm(formId) {
  document.getElementById("login-form").classList.add("hidden");
  document.getElementById("signup-form").classList.add("hidden");
  document.getElementById(formId).classList.remove("hidden");
}

document
  .getElementById("login-btn")
  .addEventListener("click", function (event) {
    event.preventDefault();

    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    if (email === "" || password === "") {
      showErrorMessageSign("Please fill in both fields.");
      return;
    }

    // إرسال الطلب إلى الـ API للتحقق من بيانات المستخدم
    fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          // حفظ التوكن في الـ localStorage
          localStorage.setItem("token", data.token);
          showErrorMessageSign("Login successful!");
          window.location.href = "../dashboard-user/Home.html";  // إعادة التوجيه إلى الصفحة الرئيسية
        } else {
          showErrorMessageSign(data.message || "Incorrect email or password.");
        }
      })
      .catch(error => {
        showErrorMessageSign("An error occurred while logging in.");
        console.error(error);
      });
  });



function showErrorMessageSign(message) {
  const errorMessageDiv = document.getElementById("error-message-sign");
  errorMessageDiv.textContent = message;
  errorMessageDiv.classList.remove("hidden");

  setTimeout(() => {
    errorMessageDiv.classList.add("hidden");
  }, 3000);  

}
function showErrorMessageReg(message) {
  const errorMessageDiv = document.getElementById("error-message-reg");
  errorMessageDiv.textContent = message;
  errorMessageDiv.classList.remove("hidden");

  setTimeout(() => {
    errorMessageDiv.classList.add("hidden");
  }, 3000);  
}

document
  .getElementById("signup-btn")
  .addEventListener("click", function (event) {
    event.preventDefault();

    const fullName = document.getElementById("full-name").value;
    const userName = document.getElementById("username").value;
    const email = document.getElementById("signup-email").value;
    const phone = document.getElementById("phone-number").value;
    const password = document.getElementById("signup-password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    if (!fullName || !userName || !email || !password || !confirmPassword) {
      showErrorMessageReg("Please fill in all required fields!");
      return;
    }

    if (password !== confirmPassword) {
      showErrorMessageReg("Password and Confirm Password do not match!");
      return;
    }

    // إرسال البيانات إلى الـ API لإنشاء الحساب
    fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fullName, userName, email, phone, password }),
    })
      .then(response => response.json())
      .then(data => {
        console.log(data)
        if (data.success) {
          showErrorMessageSign("Account created successfully! please login again");
          showForm('login-form');  // الانتقال إلى نموذج تسجيل الدخول بعد إنشاء الحساب
        } else {
          console.log("no registration")
          showErrorMessageReg(data.message || "There was an error during registration.");
        }
      })
      .catch(error => {
        showErrorMessageReg("An error occurred while creating the account.");
        console.error(error);
      });
  });

  const token = localStorage.getItem("token");
  if (token) {
    try {
      const decoded = jwt_decode(token); 
      console.log(decoded);  
    } catch (error) {
      console.error("Invalid token");
    }
  } else {
    console.log("No token found");
  }
  
  
