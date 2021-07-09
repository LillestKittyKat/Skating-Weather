var weatherData;
var position = [];
var button;
dayoneele = document.getElementById("day1")
daytwoele = document.getElementById("day2")
daythreeele = document.getElementById("day3")
dayfourele = document.getElementById("day4")
dayfiveele = document.getElementById("day5")

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
    // document.getElementById('content2').innerHTML = "Lat: " + position[0].toFixed(2) + ", Lon: " + position[1].toFixed(2);
    // loadJSON('https://api.openweathermap.org/data/2.5/forecast?lat=' + position[0] + '&lon=' + position[1] + '&appid=24af55e05930810f0386c8f7559871e0&units=metric', gotData)
    // document.write(get_json(), fn)
    fetch('https://api.openweathermap.org/data/2.5/forecast?lat=' + position[0] + '&lon=' + position[1] + '&appid=24af55e05930810f0386c8f7559871e0&units=metric')
        .then(response => response.json())
        .then(data => json_process(data));

}

function json_process(data) {
    console.log(data);
    document.getElementById('for').innerHTML = "for " + data.city.name
        // Get first day
    let currentDay = getDateMonth(data.list[0].dt_txt)[1]
        // console.log("dayOne is " + currentDay.toString())
    let index = currentDay
    let count = 0
    let todaysData = []

    for (let i = 0; i < 8; i++) {
        if (getDateMonth(data.list[i].dt_txt)[1] > index) {
            console.log(getDateMonth(data.list[i].dt_txt)[1])
            break
        }

        let day = []
        day[0] = getDateMonth(data.list[i].dt_txt)[1]
        day[1] = getHour(data.list[i].dt_txt)
        day[2] = processWeather(data.list[i].weather[0].description)
        day[3] = processWind(data.list[i].wind.gust)
        todaysData[i] = day
        count++
    }
    console.log(todaysData)
        // console.log("Count is " + count.toString())
    dataString = ""

    document.getElementById('data0').innerHTML = generateData(todaysData)[0]
    document.getElementById('row0').style.backgroundColor = generateData(todaysData)[1]

    // document.getElementById('data0').style('color') =

    // Get remaining days
    let remainingData = []
    let currentCount = 0

    for (let i = count; i < 40; i++) {
        if (getHour(data.list[i].dt_txt) < 9 || getHour(data.list[i].dt_txt) > 21) {
            continue
        }
        // console.log(weatherData.length)
        if (remainingData.length == 20) {
            break
        }
        // console.log(count)
        let day = []
        day[0] = getDateMonth(data.list[i].dt_txt)[1]
        day[1] = getHour(data.list[i].dt_txt)
        day[2] = processWeather(data.list[i].weather[0].description)
        day[3] = processWind(data.list[i].wind.gust)
        remainingData[currentCount] = day
        currentCount++
    }
    console.log(remainingData)

    let days = []
    days[0] = "Today"
    days[1] = "Tomorrow"
    for (let i = 2; i < 5; i++) {
        days[i] = remainingData[(i - 1) * 5][0].toString() + processSuffix(remainingData[(i - 1) * 5][0])
    }
    // document.write(data.list[0]);
    // document.getElementById('content1').innerHTML = data.city.name;
    getDateMonth(data.list[0].dt_txt)
        // console.log(data.list[0].wind.gust)
        // console.log(processWind(data.list[0].wind.gust))
    processWeather(data.list[0].weather[0].description)

    // Put data into DIV fields (final part)
    for (let i = 0; i < 5; i++) {
        if (i == 0) {
            document.getElementById("day" + (i + 1).toString()).innerHTML = days[i]
        } else if (i == 1) {
            document.getElementById("day" + (i + 1).toString()).innerHTML = days[i]
        } else {
            document.getElementById("day" + (i + 1).toString()).innerHTML = days[i]
        }

    }

    for (let i = 0; i < 4; i++) {
        let tempData = []
        for (let j = 0; j < 5; j++) {
            tempData[j] = remainingData[(i * 5) + j]
        }
        document.getElementById('data' + (i + 1)).innerHTML = generateData(tempData)[0]
        tempColor = generateData(tempData)[1]
        if (tempColor == "amber") {
            tempColor = "orange"
        }
        document.getElementById('row' + (i + 1)).style.backgroundColor = tempColor
        console.log(generateData(tempData)[1])
        tempData = []
    }

}

function getDateMonth(dateMonth) {
    var outArr = [];
    outArr[0] = parseInt(dateMonth.substring(5, 7));
    outArr[1] = parseInt(dateMonth.substring(8, 10));
    // console.log(outArr[0]);
    // console.log(outArr[1])
    // console.log(processSuffix(outArr[1]))
    return outArr;
}

function processSuffix(date) {
    switch (date) {
        case 1:
            return 'st'
        case 2:
            return 'nd'
        case 3:
            return 'rd'
        default:
            return 'th'
    }
}

function processWind(speed) {
    if (speed < 10) {
        return 'green'
    }
    if (speed < 15) {
        return 'amber'
    } else {
        return 'red'
    }
}

function processWeather(weather) {
    if (weather.search(/rain/gi) > 0) {
        return "red"
    } else if (weather.search(/cast/gi) > 0) {
        return "amber"
    } else {
        return "green"
    }
}

function getHour(hour) {
    return parseInt(hour.substring(11, 13))
}

function generateData(data) {
    let weatherColors = []
    returnColor = "green"
    for (let i = 0; i < 6; i++) {
        weatherColors[i] = "green"
    }

    for (let i = 0; i < data.length; i++) {
        // Process AM
        // console.log(data[i][3])
        if (data[i][1] < 15) {
            // Process AM Rain

            if (data[i][2] == "red") {
                weatherColors[0] = "red"
                if (returnColor != "red") {
                    returnColor = "red"
                }
            }

            // if (data[i][2] != weatherColors[0]) {
            //     if (weatherColors[0] != "red") {

            //         weatherColors[0] = data[i][2]
            //         if (returnColor != "red") {
            //             returnColor = data[i][2]
            //         } else {
            //             outputData = data[i][2]
            //         }
            //     }
            // }

            // Process AM Wind
            if (data[i][3] != weatherColors[1]) {
                if (weatherColors[1] != "red") {
                    weatherColors[1] = data[i][3]
                    if (returnColor != "red") {
                        returnColor = data[i][3]
                    } else {
                        outputData = data[i][3]
                    }
                }
            }
        }
        // Process PM
        if (data[i][1] < 21) {
            //Process PM Rain

            if (data[i][2] == "red") {
                weatherColors[2] = "red"
                if (returnColor != "red") {
                    returnColor = "red"
                }
            }

            // if (data[i][2] != weatherColors[2]) {
            //     if (weatherColors[2] != "red") {
            //         weatherColors[2] = data[i][2]
            //         if (returnColor != "red") {
            //             returnColor = data[i][2]
            //         } else {
            //             outputData = data[i][2]
            //         }
            //     }
            // }

            //Process PM Wind
            if (data[i][3] != weatherColors[3]) {
                if (weatherColors[3] != "red") {
                    weatherColors[3] = data[i][3]
                    if (returnColor != "red") {
                        returnColor = data[i][3]
                    } else {
                        outputData = data[i][3]
                    }
                }
            }
        }
        // Process Night
        if (data[i][1] == 21) {
            // Process Night Rain

            if (data[i][2] == "red") {
                weatherColors[4] = "red"
                if (returnColor != "red") {
                    returnColor = "red"
                }
            }

            // if (data[i][2] != weatherColors[4]) {
            //     if (weatherColors[4] != "red") {
            //         weatherColors[4] = data[i][2]
            //         if (returnColor != "red") {
            //             returnColor = data[i][2]
            //         } else {
            //             outputData = data[i][2]
            //         }
            //     }
            // }

            // Process Night Wind
            if (data[i][3] != weatherColors[5]) {
                if (weatherColors[5] != "red") {
                    weatherColors[5] = data[i][3]
                    if (returnColor != "red") {
                        returnColor = data[i][3]
                    } else {
                        outputData = data[i][3]
                    }
                }
            }
        }

    }
    let dataString = ""
    for (let i = 0; i < 6; i++) {
        if (weatherColors[i] != "green") {
            if (weatherColors[i] == "amber" && (i % 2 == 0)) {
                continue
            }
            // console.log("Found non green data")
            if (i < 2) {
                dataString += "Morning "
            } else if (i < 4) {
                dataString += "Afternoon "
            } else {
                dataString += "Evening "
            }

            if (i % 2 > 0) {
                dataString += "high winds "
            } else {
                dataString += "rain "
            }
            if (weatherColors[i] == "amber") {

                dataString += "warning<br>"

            } else if (weatherColors[i] == "red") {
                dataString += "expected<br>"
            }

        }
    }

    return [dataString, returnColor]
}