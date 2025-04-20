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


  //get users data 
  fetch('http://localhost:5000/api/admin/users', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
    })
    .then(response => response.json())
    .then(data => {
        if (data && data.message !=='Invalid token') {
            console.log(data);
            const table = document.getElementById("tableBody");
            for(i=0; i<data.length ; i++){
              const newRow = table.insertRow();
              
              const newCell = newRow.insertCell();//add full name to the table
              const newText = document.createTextNode(data[i].fullName);
              newCell.appendChild(newText);

              const newCell1 = newRow.insertCell();//add email to the table
              const newText1 = document.createTextNode(data[i].email);
              newCell1.appendChild(newText1);

              const newCell2 = newRow.insertCell();//add role to the table
              const newText2 = document.createTextNode(data[i].role);
              newCell2.appendChild(newText2);

              const newCell3 = newRow.insertCell();//add phone to the table
              const newText3 = document.createTextNode(data[i].phone);
              newCell3.appendChild(newText3);

              const newCell7 = newRow.insertCell();//add user name to the table
              const newText7 = document.createTextNode(data[i].userName);
              newCell7.appendChild(newText7);

              const newCell4 = newRow.insertCell();//add created at date to the table
              const newText4 = document.createTextNode(data[i].createAt);
              newCell4.appendChild(newText4);

              const newCell5 = newRow.insertCell();//add last login date to the table
              const newText5 = document.createTextNode(data[i].lastLogin);
              newCell5.appendChild(newText5);

              const newCell8 = newRow.insertCell();//add id to the table, id is needed to DB queries. 
              const newText8 = document.createTextNode(data[i].id);
              newCell8.classList.add("hidden");//hide id from admin, just use it on fetch queries
              newCell8.appendChild(newText8);

              const newCell6 = newRow.insertCell();//edit cell
              const button = document.createElement("button");
              const li = document.createElement("li");
              const liText = document.createTextNode("Edit");
              li.classList.add("fas");
              li.classList.add("fa-edit");
              button.classList.add("edit-btn");
              button.appendChild(li);
              button.appendChild(liText);              
              newCell6.appendChild(button);
              li.onclick = function(event){
                openEditModal(event);
              }
          }           
            
        }
    })
    .catch(err => {
        console.error('error', 'Error fetching users.'+err);
    }); 

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
    console.log(selectedRow.cells[7].textContent)

    document.getElementById("fullName").value = selectedRow.cells[0].textContent;
    document.getElementById("email").value = selectedRow.cells[1].textContent;
    document.getElementById("role").value = selectedRow.cells[2].textContent.toLowerCase();
    document.getElementById("phone").value = selectedRow.cells[3].textContent;
    document.getElementById("userName").value = selectedRow.cells[4].textContent;
    document.getElementById("id").value = selectedRow.cells[7].textContent;
    //console.log(de.getElementById("id").value);
  }

  // ✅ Function to close the edit modal
  function closeEditModal() {
    modal.style.display = "none";
  }

  // ✅ Function to handle form submission
  function handleFormSubmit(event) {
    event.preventDefault(); // Prevent page reload

    const fullName = document.getElementById("fullName")?.value.trim();
    const email = document.getElementById("email")?.value.trim();
    const phone = document.getElementById("phone")?.value.trim();
    const role = document.getElementById("role")?.value;
    const password = document.getElementById("password")?.value.trim();
    const userName = document.getElementById("userName")?.value.trim();
    const id = document.getElementById("id")?.value.trim();
 

    if (!fullName || !email || !phone || !role || !userName) {
      showNotification("error", "Please fill in all required fields.");
      return;
    }

    fetch('http://localhost:5000/api/admin/update', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },//email, fullName, userName, phone, password, role
      body: JSON.stringify({email, fullName: fullName, userName, phone, password, id, role}),
  })
  .then(response => response.json())
  .then(data => {
    console.log(data); 
    if(data.success){
    showNotification("success", "Changes saved successfully!");
    setTimeout(() => {
      closeEditModal(); // Close the modal after saving
    }, 1500);
  }else {
    showNotification("error", data.message);
  }
  })
  .catch(err => {
      console.error('error', 'Error update user: '+err)
  });     
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
      const id = selectedRow.cells[7].textContent;
      fetch('http://localhost:5000/api/admin/user/'+id, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);  
        showNotification("success", "Account deleted successfully.");      
    })
    .catch(err => {
        showNotification('error', 'Error deleting account.'+ err);
    });     
      modal.remove();
    });
  }

  // ✅ Add event listeners to components
  editButtons.forEach((button) => button.addEventListener("click", openEditModal));
  closeModal.addEventListener("click", closeEditModal);
  form.addEventListener("submit", handleFormSubmit);
  if (deleteButton) deleteButton.addEventListener("click", handleDeleteAccount);
});


// تحديد الزر
const logoutBtn = document.getElementById('logout-link');
// عند الضغط على زر "تسجيل الخروج"
logoutBtn.addEventListener('click', () => {
  // إعادة التوجيه إلى صفحة تسجيل الدخول
  localStorage.removeItem("token");
  window.location.href = '../user/login/index.html';  // استبدال 'login.html' بالصفحة المطلوبة
});
