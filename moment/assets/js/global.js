
const server = "https://s.hahaha.cc/api/hahaha/";

const limit = 15;
var page = 1;
var token = localStorage.getItem('token');

function loginCheck(callback){
    // var path = window.location.pathname;
    // if (path.indexOf("login") != -1){
    //     return;
    // }

    fetch(server + 'login', {
        method: 'GET',
        headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + token
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        if (data == undefined || data.code != 100000){
            callback(false);
            return;
        }
        callback(true);
        return;
    })
    .catch(error => {
        console.error('Error:', error);
        callback(false);
        return;
    });
}

// function routers(key){

//     switch(key){
//         case "index":
//             window.location.href="index.html";
//             break;
//         case "login":
//             window.location.href="login.html";
//             break;
       
//     }

// }

