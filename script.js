const socket = io();

// Search for geolocation
if (navigator.geolocation) {
    navigator.geolocation.watchPosition((position) => {
        const { latitude, longitude } = position.coords;
        socket.emit("send-location", { latitude, longitude });
    }, (error) => {
        console.log(error);
    }, {
        enableHighAccuracy: true,
        timeout: 5000, // To check coordinates every 5 seconds
        maximumAge: 0 // For fetching current data instead of cached data
    });
}

const map = L.map("map").setView([0.0, 0.0], 16); // Set default coordinates [latitude, longitude]
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "JAI JAPNAM TRACKER"
}).addTo(map);

const marker = {};

socket.on("recieve-location", (data) => {
    const { id, latitude, longitude } = data;
    map.setView([latitude, longitude], 16);
    if (marker[id]) {
        marker[id].setLatLng([latitude, longitude]);
    } else {
        marker[id] = L.marker([latitude, longitude]).addTo(map);
    }
});

socket.on("user-disconnected", (id) => {
    if (marker[id]) {
        map.removeLayer(marker[id]);
        delete marker[id];
    }
});