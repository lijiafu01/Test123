// window.addEventListener('load', async () => {
//     await StartCamera();
//     await PauseCamera();
// });

let video;
let cameraStream = null;
let cameraIsPlaying = false; // 追蹤狀態

document.addEventListener('DOMContentLoaded', () => {
    video = document.getElementById('video');

    video.addEventListener('play', () => {
        video.style.display = 'block';
        cameraIsPlaying = true;
    });

    video.addEventListener('pause', () => {
        video.style.display = 'none';
        cameraIsPlaying = false;
    });

    video.addEventListener('ended', () => {
        video.style.display = 'none';
        cameraIsPlaying = false;
    });
});

// 啟動相機
async function StartCameraAsync() {
    if (!video) {
        console.error("Video element not found");
        return;
    }

    try {
        const constraints = { video: { facingMode: { exact: "environment" } } };
        cameraStream = await navigator.mediaDevices.getUserMedia(constraints);
        video.srcObject = cameraStream;
    } catch (mobileErr) {
        console.warn('Could not access rear camera, falling back to default camera:', mobileErr);
        try {
            cameraStream = await navigator.mediaDevices.getUserMedia({ video: true });
            video.srcObject = cameraStream;
            video.style.display = 'none';
        } catch (pcErr) {
            console.error('Error accessing camera:', pcErr);
        }
    }

    video.onloadedmetadata = function () {
        adjustVideoSize();
    };

    window.onresize = adjustVideoSize;

    function adjustVideoSize() {
        video.height = window.innerHeight;
        video.width = window.innerWidth;
    }
}

function StartCamera() {
    StartCameraAsync().catch(error => {
        console.error('Error while starting camera:', error);
    });
}

// 暫停相機
async function PauseCameraAsync() {
    if (!cameraStream) {
        console.warn('No camera stream found, attempting to start camera before pausing');
        await StartCameraAsync();
    }

    if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.enabled = false);
        console.log('Camera paused');
    } else {
        console.warn('Failed to access camera stream for pausing');
    }
}

function PauseCamera() {
    PauseCameraAsync().catch(error => {
        console.error('Error while pausing camera:', error);
    });
}

// 恢復相機
async function ResumeCameraAsync() {
    if (!cameraStream) {
        console.warn('No camera stream found, attempting to start camera before resuming');
        await StartCameraAsync();
    }

    if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.enabled = true);
        console.log('Camera resumed');
    } else {
        console.warn('Failed to access camera stream for resuming');
    }
}

function ResumeCamera() {
    ResumeCameraAsync().catch(error => {
        console.error('Error while resuming camera:', error);
    });
}

// 停止相機
async function StopCameraAsync() {
    if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        cameraStream = null;
        if (video) {
            video.srcObject = null;
        }
        console.log('Camera stopped');
    } else {
        console.warn('No camera stream to stop');
    }
}

function StopCamera() {
    StopCameraAsync().catch(error => {
        console.error('Error while stopping camera:', error);
    });
}
