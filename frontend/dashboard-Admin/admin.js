document.addEventListener("DOMContentLoaded", function () {
  const editButtons = document.querySelectorAll(".edit-btn");
  const modal = document.getElementById("updateUserModal");
  const closeModal = document.querySelector(".close");
  const form = document.getElementById("updateUserForm");
  const saveButton = document.querySelector(".btn-submit");
  const deleteButton = document.querySelector(".btn-delete");
  const notification = document.getElementById("notification");
  const notificationIcon = document.getElementById("notification-icon");
  const notificationMessage = document.getElementById("notification-message");

  let selectedRow = null;

  // ✅ Function to show notifications
  function showNotification(type, message) {
    notification.classList.remove("hidden", "success", "error");
    notification.classList.add("show", type);
    notificationMessage.textContent = message;
    notificationIcon.classList.remove("fas", "fa-check", "fa-times");

    if (type === "success") {
      notificationIcon.classList.add("fas", "fa-check");
      notification.classList.add("success");
    } else if (type === "error") {
      notificationIcon.classList.add("fas", "fa-times");
      notification.classList.add("error");
    }

    setTimeout(() => {
      notification.classList.remove("show");
      notification.classList.add("hidden");
    }, 3000);
  }

  // ✅ Function to open the edit modal
  function openEditModal(event) {
    modal.style.display = "flex";
    selectedRow = event.target.closest("tr");

    document.getElementById("name").value = selectedRow.cells[0].textContent;
    document.getElementById("email").value = selectedRow.cells[1].textContent;
    document.getElementById("role").value = selectedRow.cells[2].textContent.toLowerCase();
    document.getElementById("phone").value = selectedRow.cells[3].textContent;
  }

  // ✅ Function to close the edit modal
  function closeEditModal() {
    modal.style.display = "none";
  }

  // ✅ Function to handle form submission
  function handleFormSubmit(event) {
    event.preventDefault(); // Prevent page reload

    const name = document.getElementById("name")?.value.trim();
    const email = document.getElementById("email")?.value.trim();
    const phone = document.getElementById("phone")?.value.trim();
    const role = document.getElementById("role")?.value;
    const password = document.getElementById("password")?.value.trim();

    if (!name || !email || !phone || !role) {
      showNotification("error", "Please fill in all required fields.");
      return;
    }

    showNotification("success", "Changes saved successfully!");

    setTimeout(() => {
      closeEditModal(); // Close the modal after saving
    }, 1500);
  }

  // ✅ Function to handle account deletion
  function handleDeleteAccount() {
    const modal = document.createElement("div");
    modal.classList.add("modal");
    modal.style.display = "flex";
    modal.innerHTML = `
        <div class="modal-content">
            <p>Are you sure you want to delete the account?</p>
            <button class="btn-confirm">Yes, delete</button>
            <button class="btn-cancel">Cancel</button>
        </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector(".btn-cancel").addEventListener("click", function () {
      modal.remove();
    });

    modal.querySelector(".btn-confirm").addEventListener("click", function () {
      showNotification("success", "Account deleted successfully.");
      modal.remove();
    });
  }

  // ✅ Add event listeners to components
  editButtons.forEach((button) => button.addEventListener("click", openEditModal));
  closeModal.addEventListener("click", closeEditModal);
  form.addEventListener("submit", handleFormSubmit);
  if (deleteButton) deleteButton.addEventListener("click", handleDeleteAccount);
});



//---------home ----------------------------------------------------

// إحصائيات المستخدمين
document.getElementById("totalUsers").textContent = 100;
document.getElementById("activeUsers").textContent = 80;
document.getElementById("inactiveUsers").textContent = 20;
document.getElementById("newUsers").textContent = 10;

// إنشاء المخطط البياني باستخدام Chart.js
const ctx = document.getElementById("userStatsChart").getContext("2d");
const userStatsChart = new Chart(ctx, {
  type: "pie", 
  data: {
    labels: ["Active Users", "Inactive Users", "New Users"],
    datasets: [
      {
        label: "User Statistics",
        data: [80, 20, 10], // بيانات المستخدمين (النشطين وغير النشطين والجدد)
        backgroundColor: ["#3498db", "#e74c3c", "#f39c12"],
        borderColor: ["#2980b9", "#c0392b", "#f39c12"],
        borderWidth: 1,
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: true, 
    aspectRatio: 1.5, 
    animation: {
      animateRotate: true,
      animateScale: true, 
      duration: 1500,
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function(tooltipItem) {
            return tooltipItem.label + ": " + tooltipItem.raw + " users"; 
          },
        },
      },
    },
    hover: {
      mode: 'nearest', 
      intersect: false,
      animationDuration: 500, 
    },
  },
});


// دالة لزيادة الأرقام تدريجياً
function animateCounter(id, start, end, duration) {
  let element = document.getElementById(id);
  let range = end - start;
  let current = start;
  let increment = range / (duration / 10); 
  let timer = setInterval(() => {
    current += increment;
    element.textContent = Math.round(current);
    if (current >= end) {
      element.textContent = end; 
      clearInterval(timer);
    }
  }, 10);
}

// تنفيذ التأثير عند تحميل الصفحة
document.addEventListener("DOMContentLoaded", () => {
  animateCounter("totalUsers", 0, 300, 2000); 
  animateCounter("activeUsers", 0, 200, 2000);
  animateCounter("inactiveUsers", 0, 60, 2000); 
  animateCounter("newUsers", 0, 50, 2000); 
});


// تحديد الزر
const logoutBtn = document.getElementById('logoutBtn');

// عند الضغط على زر "تسجيل الخروج"
logoutBtn.addEventListener('click', () => {
  // إعادة التوجيه إلى صفحة تسجيل الدخول
  localStorage.removeItem("token");
  window.location.href = '../../user/login/index.html';  // استبدال 'login.html' بالصفحة المطلوبة
});
