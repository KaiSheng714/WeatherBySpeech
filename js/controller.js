(function Controller() {

  var recBtn = document.querySelector('#recBtn'),
    recIcon = document.querySelector('#recIcon'),
    recText = document.querySelector('#recText'),
    recognition = new Speech().getRecognition(),
    weather = new Weather(),
    weatherUrl;

  (function init() {
    weather.getAllCity();
    weather.getUrl().then(function (url) {
      weatherUrl = url.img;
      console.log("服務狀態: 已連接天氣資料庫");
    }).catch(function (error) {
      console.error("服務狀態: 無法連接天氣資料庫， error: " + error);
    });

    recBtn.onclick = function () {
      recognition.start();
      recText.value = "收音中...";
      recIcon.classList.remove("glyphicon-volume-up");
      recIcon.classList.add("glyphicon-signal");
    }

  })();

  recognition.onresult = function (event) {
    var last = event.results.length - 1,
      result = event.results[last][0].transcript,
      city = result.substring(0, 2),
      town = result.substring(3);

    recText.value = result;
    console.log(city + ' Confidence: ' + event.results[0][0].confidence);
    var townId = weather.getTownId(city, town);
    weather.getTownWeather(townId).then(function (townWeather) {
      console.log(townWeather);
      infoWindow.setContent(prepareWeatherContent(townWeather));
      infoWindow.open(map, marker);
      marker.setIcon(weatherUrl + townWeather.img);
      marker.setVisible(true);
    }).catch(function (err) {
      recText.value = "無法辨識城市: " + result;
      resetMap();
    });

    function prepareWeatherContent(townWeather) {
      return '<div id="infoWindowContent">' +
      '<div>' +
      '現在氣溫: ' + townWeather.temperature + '°C ' +
        '</div>' +
        '<div>' +
        '體感溫度: ' + townWeather.felt_air_temp + '°C ' +
        '</div>' +
        '<div>' +
        '現在濕度: ' + townWeather.humidity + '%' +
        '</div>' +
        '<div>' +
        '降雨機率: ' + townWeather.rainfall + '%' +
        '</div>' +
        '<div>' +
        '日出時間: ' + townWeather.sunrise +
        '</div>' +
        '<div>' +
        '日落時間: ' + townWeather.sunset +
        '</div>' +
        '</div>';
    }

    weather.getTownData(townId).then(function (townData) {
      console.log(townData);
      var townLat = parseFloat(townData.position.lat),
        townLng = parseFloat(townData.position.lng);
      map.panTo({
        lat: townLat,
        lng: townLng
      })
      map.setZoom(15);
      marker.setPosition({
        lat: townLat,
        lng: townLng
      });
      marker.setMap(map);
    });

  }

  recognition.onspeechend = function () {
    recognition.stop();
    resetView();
  }

  recognition.onnomatch = function (event) {
    recText.value = "無法辨識城市";
    resetMap();
    resetView();
  }

  recognition.onerror = function (event) {
    recText.value = 'Error: ' + event.error;
    resetView();
    resetMap();
  }

  function resetView() {
    recBtn.disabled = false;
    recIcon.classList.remove("glyphicon-signal");
    recIcon.classList.add("glyphicon-volume-up");
  }

})();