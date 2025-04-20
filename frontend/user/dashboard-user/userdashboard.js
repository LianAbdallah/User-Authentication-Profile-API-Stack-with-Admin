document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form');
    const notification = document.getElementById('notification');
    const notificationIcon = document.getElementById('notification-icon');
    const notificationMessage = document.getElementById('notification-message');
    const btnDelete = document.querySelector('.btn-delete');
    const modal = document.createElement('div');

    function showNotification(type, message) {
        notification.classList.remove('hidden');
        notification.classList.add('show', type); 
        notificationMessage.textContent = message;
        notificationIcon.classList.remove('fas', 'fa-check', 'fa-times');
        
        if (type === 'success') {
            notificationIcon.classList.add('fas', 'fa-check');
            notification.classList.add('success');  
            notification.classList.remove('error');
        } else if (type === 'error') {
            notificationIcon.classList.add('fas', 'fa-times');
            notification.classList.add('error');  
            notification.classList.remove('success'); 
        }
    
        setTimeout(() => {
            notification.classList.remove('show');
            notification.classList.add('hidden');
        }, 5000); 

        console.log("DOMContentLoaded")

  
    }
    

    // Handle form submission (Saving changes)
    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const name = document.getElementById('user-name').value.trim();
        const email = document.getElementById('user-email').value.trim();
        const phone = document.getElementById('user-phone').value.trim();
        const password = document.getElementById('password').value.trim();
        const confirmPassword = document.getElementById('confirm-password').value.trim();

        // Basic validation
        if (!name || !email || !phone || (password && password !== confirmPassword)) {
            showNotification('error', 'Please fill out all fields correctly.');
            return;
        }

// Submit data to backend
fetch('http://localhost:5000/api/profile/profile', {
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({ email, fullName: name, userName: name, phone, password }),
})
.then(response => response.json())
.then(data => {
    if(data.success){
    showNotification('success', 'Profile updated successfully!');
    window.location.href = './Home.html'; // توجيه المستخدم إلى الصفحة الرئيسية
}else {
    showNotification('error', data.message);
}
})
.catch(err => {
    showNotification('error', 'Error updating profile.'+err);
});
});


 // Delete account functionality
 btnDelete.addEventListener('click', function () {
    if (confirm('Are you sure you want to delete your account?')) {
        const id = document.getElementById('id').value.trim();
        fetch('http://localhost:5000/api/profile/delete'+id, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            if (data.success === true) {
                showNotification('success', 'Your account has been deleted.');
                window.location.href = '../login/index.html'; // إعادة توجيه المستخدم إلى صفحة تسجيل الدخول بعد الحذف
            }
        })
        .catch(err => {
            showNotification('error', 'Error deleting account.'+ err);
        });
    }
});
});

const logoutBtn = document.getElementById('logoutBtn');

logoutBtn.addEventListener('click', () => {
    localStorage.removeItem("token");
    //localStorage.clear();
    window.location.href = 'login.html';  
});
