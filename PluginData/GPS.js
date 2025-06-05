//window.addEventListener('load', StartGPS);

let watchId = null;
let gpsIsTracking = false; // 追蹤狀態

// 啟動位置追蹤
function StartGPS() {
    if (!gpsIsTracking) {
        const options = {
            enableHighAccuracy: true, // 啟用高精度定位
            timeout: 5000,            // 設置超時
            maximumAge: 0             // 禁用緩存
        };

        try {
            watchId = navigator.geolocation.watchPosition(GPSPosition, GPSError, options);
            gpsIsTracking = true;
            console.log('位置追蹤已啟動');
        } catch (e) {
            console.log('啟動位置追蹤時發生異常:', e);
        }
    }
}

// 停止位置追蹤
function StopGPS() {
    if (gpsIsTracking && watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
        watchId = null;
        gpsIsTracking = false;
        console.log('位置追蹤已停止');
    }
}

// 示例：成功獲取位置的回調函數
function GPSPosition(position) {
    const clat = position.coords.latitude;
    const clng = position.coords.longitude;

    //小數第5位，精度誤差1公尺
    const GPSData = {
        lat: clat,
        lon: clng
    };

    const jsonData = JSON.stringify(GPSData);

    try {
        // 調用 Unity 方法，傳遞 JSON 字符串
        if (typeof gameInstance.SendMessage !== 'undefined') {
            gameInstance.SendMessage('DeviceManager', 'OnDeviceGPS', jsonData);
            console.log('GPSData:', jsonData);
        } else {
            StopGPS();
            console.warn('SendMessage 方法未定義');
        }
    } catch (error) {
        StopGPS();
        console.error('調用 SendMessage 方法時發生錯誤:', error);
    }
}

// 示例：處理位置獲取錯誤的回調函數
function GPSError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            console.log('用戶拒絕了請求地理位置。');
            break;
        case error.POSITION_UNAVAILABLE:
            console.log('無法獲取到位置資訊。');
            break;
        case error.TIMEOUT:
            console.log('獲取位置資訊超時。');
            break;
        case error.UNKNOWN_ERROR:
            console.log('發生未知錯誤。');
            break;
    }
    StopGPS();
}
