document.addEventListener('DOMContentLoaded', function () {
    console.log("start fetch user data")

    fetch('http://localhost:5000/api/profile/profile', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
    })
    .then(response => response.json())
    .then(data => {
        if (data && data.message !=='Invalid token') {
            console.log(data)
            const username = document.getElementById('user-name');
            while( username.firstChild ) {
                username.removeChild( username.firstChild );
            }
            username.appendChild( document.createTextNode(data.userName) );

            const email = document.getElementById('email');
            while( email.firstChild ) {
                email.removeChild( email.firstChild );
            }
            email.appendChild( document.createTextNode(data.email) );

            const phone = document.getElementById('phone');
            while( phone.firstChild ) {
                phone.removeChild( phone.firstChild );
            }
            phone.appendChild( document.createTextNode(data.phone) );


            const created = document.getElementById('created-at');
            while( created.firstChild ) {
                created.removeChild( created.firstChild );
            }
            created.appendChild( document.createTextNode(data.createAt) );

            const last = document.getElementById('last-login');
            while( last.firstChild ) {
                last.removeChild( last.firstChild );
            }
            last.appendChild( document.createTextNode(data.lastLogin) );
            
            
            if(data.role === 'user'){                
                const adminBtn = document.getElementById('adminBtn');
                adminBtn.remove();
            }
        }else{
            window.location.href = '../login/index.html';  
        }
    })
    .catch(err => {
        console.error('error', 'Error fetching account.'+err)
    }); 
 
}); 

const logoutBtn = document.getElementById('logoutBtn');

logoutBtn.addEventListener('click', () => {
    localStorage.removeItem("token");
    //localStorage.clear();
    window.location.href = 'login.html';  
});