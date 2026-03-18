function requestNotificationPermission() {
    if ("Notification" in window) {
        Notification.requestPermission();
    }
}

// Function to trigger the actual notification
function showOrderReadyNotification() {
    if (Notification.permission === "granted") {
        new Notification("ZPPSU Canteen", {
            body: "Your order is ready! You can pick it up now.",
            icon: "assets/icon.png" // Put your app logo here
        });
    }
}