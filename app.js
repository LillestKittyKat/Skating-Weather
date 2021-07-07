var weatherData;
var position = [];
var button;


console.log('starting');

function updateClicked() {
    if (!navigator.geolocation) {
        document.getElementById('alert').innerHTML = "navigator.geolocation is not available";
    }
    navigator.geolocation.getCurrentPosition(setPos);
}



function setPos(position) {
    if (position) {
        position[0] = position.coords.latitude;
        position[1] = position.coords.longitude;
    } else {
        position[0] = 50;
        position[1] = -1;
    }
    document.getElementById('content2').innerHTML = "Lat: " + position[0].toFixed(2) + ", Lon: " + position[1].toFixed(2);
    // loadJSON('https://api.openweathermap.org/data/2.5/forecast?lat=' + position[0] + '&lon=' + position[1] + '&appid=24af55e05930810f0386c8f7559871e0&units=metric', gotData)
    // document.write(get_json(), fn)
    fetch('https://api.openweathermap.org/data/2.5/forecast?lat=' + position[0] + '&lon=' + position[1] + '&appid=24af55e05930810f0386c8f7559871e0&units=metric')
        .then(response => response.json())
        .then(data => json_process(data));

}

function json_process(data) {
    console.log(data);
    // document.write(data.list[0]);
    document.getElementById('content1').innerHTML = data.city.name;

}