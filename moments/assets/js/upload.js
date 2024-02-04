var filesCos = [];
var filesToUpload = [];
var fileInput;

// 给fileinput添加监听事件
function fileInputAddEventListener(files, uploadBtn){

    // 文件输入框
    // const fileInput = document.getElementById('fileInput');
    //  document.querySelector('#uploadBtn').addEventListener('click',
    //     function() {
    //         // 触发文件输入框的点击事件
    //         fileInput.click();
    // });

    fileInput = files;

    // 用于显示选中文件的图片容器
    const preview = document.getElementById('imageContainer');



    // 读取文件
    function readAndPreview(file) {
    // if ( /\.(jpe?g|png|gif)$/i.test(file.name) ) {
        var reader = new FileReader();
        // 当文件读取完成时
        reader.onload = function (e) {
            var imageContainer = document.createElement('div');
            imageContainer.className = 'image-container';
            var image = new Image();
            image.title = file.name;
            image.src = e.target.result;
            imageContainer.appendChild(image);

            var close = document.createElement('div');
            close.className = 'close';
            close.textContent = '❎';
            close.id = 'img-' + file.name;
            close.onclick = function() {
                var index = filesToUpload.indexOf(file);
                if (index > -1) {
                    filesToUpload.splice(index, 1);
                    preview.removeChild(imageContainer);
                }
            }
            imageContainer.appendChild(close);
            preview.appendChild(imageContainer);

            filesToUpload.push(file);
            console.log('文件类型:', file.type);
        };
        reader.readAsDataURL(file);
    // }
    }


    // 伪上传按钮点击事件
    if (uploadBtn != undefined && uploadBtn != "" && uploadBtn != null){
        uploadBtn.addEventListener('click',
            function() {
                // 触发文件输入框的点击事件
                fileInput.click();
        });
    }

     // 当文件输入框的内容改变时
    fileInput.addEventListener('change', function() {
            var files = fileInput.files;
            // var files   = document.querySelector('input[type=file]').files;
            if (files) {
                [].forEach.call(files, readAndPreview);
            }
        }
    );
}



// 获取预签名URL并上传
function upload() {

    // 上传云存储
    function uploadFilesToRemote(presignedUrlObj, file){
        // 使用 fetch API 来上传文件
        fetch(presignedUrlObj["pre_url"], {
            method: 'PUT',
            body: file
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('上传失败');
            }
            //alert('上传成功');
            // var imageContainers = document.getElementsByClassName('image-container');
            // while(imageContainers[i]) {
            //     imageContainers[i].parentNode.removeChild(imageContainers[i]);
            // }

            // document.getElementById('img-'+file.name).parentNode.removeChild(document.getElementById('img-'+file.name));

            document.getElementById('img-' + file.name)
                .textContent = '✅';
            document.getElementById('img-' + file.name)
                .onclick = function() {};
            // filesToUpload = [];
            // document.getElementById('createStatusUrl').value = null;
            filesCos.push(presignedUrlObj["file_name"]);

            console.log('response:', response);
            if (filesCos.length == filesToUpload.length) {
                console.log("全部上传完毕");
                filesToUpload = [];
                filesCos = [];
                //document.getElementById('createStatusUrl').value = null;
                fileInput.value = null;
            }
        })
        .catch(error => {
            console.error('Error:', error);
           // alert('上传失败');
        });
    }

    // 获取预签名URL
    for (var i = 0; i < filesToUpload.length; i++) {
        (function(file) {
            fetch(server + "storage", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": "Bearer " + token
                },
                body: JSON.stringify({
                    "file_name": file.name
                })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('获取签名失败');
                }
                return response.json();
            })
            .then(data => {
                if (data == undefined || data.code == 100002) {
                    window.location.href = 'login.html';
                }
                // 预签名URL
                var presignedUrls = data.data;
                for (var i = 0; i < presignedUrls.length; i++) {
                    // 真正进行云存储上传
                    uploadFilesToRemote(presignedUrls[i],file);
                }
              
            })
            .catch(error => {
                console.error('Error:', error);
                //alert('获取与签名失败');
            });
        })(filesToUpload[i]);
    }
}
