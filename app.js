var weatherData;
var position = [];
var button;

var options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0
};
//console.log('starting');

function json_process(data) {
    console.log(data);
    // document.write(data.list[0]);
    document.getElementById('content1').innerHTML = data.city.name;

}

function setPos(positionInput) {
  console.log('setPos');
    if (positionInput) {
        position[0] = positionInput.coords.latitude;
        position[1] = positionInput.coords.longitude;
    } else {
        position[0] = 50;
        position[1] = -1;
    }
    console.log("position[0]" + position[0]);
    console.log("position[1]" + position[1]);
    document.getElementById('content2').innerHTML = "Lat: " + position[0].toFixed(2) + ", Lon: " + position[1].toFixed(2);
    // loadJSON('https://api.openweathermap.org/data/2.5/forecast?lat=' + position[0] + '&lon=' + position[1] + '&appid=24af55e05930810f0386c8f7559871e0&units=metric', gotData)
    // document.write(get_json(), fn)
    fetch('https://api.openweathermap.org/data/2.5/forecast?lat=' + position[0] + '&lon=' + position[1] + '&appid=24af55e05930810f0386c8f7559871e0&units=metric').then(response => response.json()).then(data => json_process(data));

}

function error(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
  setPos();
}

function updateClicked() {
   console.log('updateClicked');
    if (!window.navigator.geolocation) {
        console.log('window.navigator.geolocation n/a');
        document.getElementById('alert').innerHTML = "navigator.geolocation is not available";
    } else {
      console.log('window.navigator.geolocation available');
      window.navigator.geolocation.getCurrentPosition(setPos,error,options);
    }
}
