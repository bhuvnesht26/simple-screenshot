var parent, img, video, prompt1, prompt2, screenshot, download, select, label, clear;
var enable = false;
const canvas = document.createElement('canvas');
var format = '.png'

const init = () => {
    hasGetUserMedia()
    if (enable){
        parent = document.getElementsByClassName('container')[0]
        prompt1 = document.getElementById('prompt1');
        prompt2 = document.getElementById('prompt2');
        screenshot = document.getElementById('screenshot');
        clear = document.getElementById('clear');
        select = document.getElementsByTagName('select')[0]
        label = document.getElementsByTagName('label')[0]
        img = document.getElementsByTagName('img')[0];
        video = document.getElementsByTagName('video')[0];
        download = document.getElementsByClassName('download')[0]
        download.addEventListener('click', onDownload)
        document.getElementsByClassName('capture')[0].addEventListener('click', onCapture)
        screenshot.addEventListener('click', onScreenshot)
    }  
}

const hasGetUserMedia = () => {
    if (!navigator.mediaDevices && !navigator.mediaDevices.getUserMedia){
        alert('Unable to enable camera.')
    } else {
        enable = true
    }
}

const onDownload = () => {
    var download = document.createElement('a');
    download.href = img.src.replace(/^data:image\/[^;]+/, 'data:application/octet-stream')
    download.download = 'yourScreenshot' + format;
    download.style.display = 'none';
    document.body.appendChild(download);
    download.click();
    document.body.removeChild(download);
};

const onCapture = () => {
    navigator.mediaDevices
                .getUserMedia({video: true})
                .then(stream => {
                    video.srcObject = stream
                    prompt1.style.display = 'none';
                    prompt2.style.display = 'block';
                    screenshot.disabled = false;
                    clear.disabled = false;
                })
                .catch(err=>alert('Error occurred: ' + err));
}

const onScreenshot = () => {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    prompt2.style.display = 'none'
    img.src = canvas.toDataURL('image/png');
    img.style.display = 'block'
    download.disabled = false
    select.style.visibility = 'visible'
    label.style.visibility = 'visible'
}

const onFormatChange = () =>{
    format = event.target.value
}

const clearAll = () => {
    video.srcObject.getVideoTracks().forEach(track => track.stop())
    parent.removeChild(video);
    video = document.createElement("video")
    video.autoplay = true
    parent.insertBefore(video, prompt1)
    if (img){
        img.style.display = 'none'
    }
    screenshot.disabled = true;
    download.disabled = true;
    select.style.display = 'none';
    format = null;
    prompt2.style.display = 'none';
    prompt1.style.display = 'block';
    clear.disabled = true;
    
}

document.addEventListener('DOMContentLoaded', init)

//https://ourcodeworld.com/articles/read/189/how-to-create-a-file-and-generate-a-download-with-javascript-in-the-browser-without-a-server
//https://stackoverflow.com/questions/10473932/browser-html-force-download-of-image-from-src-dataimage-jpegbase64