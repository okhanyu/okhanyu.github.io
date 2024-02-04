
document.getElementById('loginButton').addEventListener('click', function() {
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;

    fetch(server + 'login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: username, password: password })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        if (data == undefined || data.code != 100000){
            console.log(data);
            return;
        }
        var token = data.data.token;
        localStorage.clear();
        localStorage.setItem('token', token);
        localStorage.setItem("userid",data.data.id);
        window.location.href = 'index.html';
        return;
    })
    .catch(error => {
        // document.getElementById('tips').textContent = 'Login failed.';
        console.error('Error:', error);
        return;
    });
});