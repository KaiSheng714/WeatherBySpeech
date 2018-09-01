function Weather() {
  var allCityArray = [];

  Weather.prototype.getUrl = function () {
    return new Promise(function (resolve, reject) {
      var xhttp = new XMLHttpRequest(),
        url = 'https://works.ioa.tw/weather/api/url.json';
      xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
          if (this.status == 200) {
            var response = JSON.parse(this.responseText);
            resolve(response);
          } else {
            reject(this.status)
          }
        }
      };
      xhttp.open("GET", url, true);
      xhttp.send();
    });
  }

  Weather.prototype.getAllCity = function () {
    return new Promise(function (resolve, reject) {
      var xhttp = new XMLHttpRequest(),
        url = 'https://works.ioa.tw/weather/api/all.json';
      xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
          var response = JSON.parse(this.responseText);
          allCityArray = response;
          console.log(allCityArray);
        }
      };
      xhttp.open("GET", url, true);
      xhttp.send();
    });
  };

  Weather.prototype.getTownId = function (cityName, townName) {
    for (var i = 0; i < allCityArray.length; i++) {
      if (allCityArray[i].name === cityName) {
        var towns = allCityArray[i].towns;
        for (var j = 0; j < towns.length; j++) {
          if (towns[j].name === townName) {
            return towns[j].id;
          }
        }
      }
    }
  };

  Weather.prototype.getTownData = function (townId) {
    return new Promise(function (resolve, reject) {
      var xhttp = new XMLHttpRequest(),
        url = 'https://works.ioa.tw/weather/api/towns/' + townId + '.json';
      xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
          var response = JSON.parse(this.responseText);
          resolve(response);
        }
      };
      xhttp.open("GET", url, true);
      xhttp.send();
    });
  };

  Weather.prototype.getTownWeather = function (townId) {
    return new Promise(function (resolve, reject) {
      var xhttp = new XMLHttpRequest(),
        url = 'https://works.ioa.tw/weather/api/weathers/' + townId + '.json';
      xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
          try {
            var response = JSON.parse(this.responseText);
            resolve(response);
          } catch (err) {
            reject('無法辨識的城市');
          }
        }
      };
      xhttp.open("GET", url, true);
      xhttp.send();
    });
  }

}