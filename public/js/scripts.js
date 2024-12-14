const socket = io();
//console.log("FGFG");

if (navigator.geolocation) {
  navigator.geolocation.watchPosition((position) => {
    const { latitude, longitude } = position.coords;
    
    socket.emit("send-location", { latitude, longitude });
  },(error)=>{
    console.error(error)
  },
{
    enableHighAccuracy:true,
    timeout:5000,
    maximumAge:0
});
}



var map = L.map('map', {
    center: [10.5656,76.132 ],
    zoom: 25
});
// var map = L.map('map').setView([51.505, -0.09], 13);
//  const map =L.map('map').setView([0,0],10)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© NTrack'
}).addTo(map);
// L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//     maxZoom: 19,
//     attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
// }).addTo(map);
const markers={}

socket.on("receive-location",(data)=>{
  const {id,latitude,longitude}=data
  map.setView([latitude,longitude],25)
  if(markers[id]){
    markers[id].setLatLng([latitude,longitude])
  }
  else{
    markers[id]=L.marker([latitude,longitude]).addTo(map)
  }
  console.log(markers);
  
})


socket.on('user-disconnected',(id)=>{
  console.log("disconnected");
  
  if(markers[id]){
    map.removeLayer(markers[id])
    delete markers[id]
  }
})
