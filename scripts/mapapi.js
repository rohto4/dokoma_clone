// mapapi.js
'use strict';

/***** 関数構造の説明を最下部に記載 *****/

// 位置情報サービスが有効な場合、地図を描画する
function setMyMarker() {
  console.log('setMyMarker');

  /**  定義部  **/
  function success(pos) {
    var myPos = {};
    var date = new Date();
    // 取得データの整理
    myData = position.coords;
    // 自分のデータの整理
    myPos['lat'] = myData.latitude;        // 緯度
    myPos['lng'] = myData.longitude;       // 経度

    // 未使用
    // myPos['alt'] = myData.altitude;              // 高度
    // myPos['accLatlng'] = myData.accuracy;        // 緯度経度の精度
    // myPos['accAlt'] = myData.altitudeAccuracy;   // 高度の精度
    // myPos['heading'] = myData.heading;           // 地図の角度 default 0=北,90=東,180=南,270=西
    // myPos['speed'] = myData.speed;               // ??

    // 自分のピンを立てる処理
    var myLatLng = new google.maps.LatLng(myPos['lat'], myPos['lng']); // 地図の中心座標

    var mapOptions = {
      zoom: 15,             // 地図の縮尺値
      center: myLatLng,     // 地図の中心座標
      mapTypeId: 'roadmap'  // 地図の種類
    };

    // 共通設定
    // 地図埋め込み
    var displayMap = new google.maps.Map(document.getElementById('map'), mapOptions);
    var myMarker = new google.maps.Marker({
      position: myLatLng,
      map: displayMap
    });
    // 吹き出しコメントを設定
    var hourStr = ('0' + date.getHours()).slice(-2);
    var minStr = ('0' + date.getMinutes()).slice(-2);
    var markTime = hourStr + ":" + minStr;
    var userName = "Ninja" // 認証済アカウント or 入力された名前 から取得
    var myContent = "[" + markTime + "] " + userName + " さん";
    var myInfoWindow = new google.maps.InfoWindow({
      content: myContent
    });
    // 吹き出しを開く
    myInfoWindow.open(displayMap, myMarker);

    // 自分の位置をfirestoreに登録
    var savedata = {'name':userName,
            'lat':myPos['lat'],
            'lng':myPos['lng'],
            'time':markTime };
    // window.dokoma =
    dokoma.saveMarker(savedata);

    // マーカー共通設定
    // 吹き出しが閉じられたら、マーカークリックで再び開くようにしておく
    google.maps.event.addListener(myInfoWindow, "closeclick", function() {
      google.maps.event.addListenerOnce(myMarker, "click", function(event) {
        myInfoWindow.open(displayMap, myMarker);
      });
    });
  }

  // 位置情報の取得に失敗した場合の処理
  function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }
  /**  /定義部  **/

  /**  実行部  *
  */
  // 位置情報取得実行
  // getCurrentPosition(success[, error[, [options]])
  // success : 成功時処理
  // error   : 失敗時処理
  // options : 失敗時設定
  navigator.geolocation.getCurrentPosition(success, error);

  /**  /実行部  **/
  }
}

// 登録済マーカーを表示
function getMembersMarker() {
  console.log('getMembersMarker');
}

function latestMyMerkar() {
  console.log('latestMyMerkar');
}

/***** 関数の説明 *****/

/*
A. → B.に変更
・認証系処理の記述に雰囲気合わせた
・理解すればネスト浅い分見やすい

A. ----------
if (navigator.geolocation){
  navigator.geolocation.getCurrentPosition(
    function(pos) {
      // 位置情報を使った処理
    },
    function(err) {
      // 位置情報取得失敗時の処理
    }
  }
}
/A.----------

B. ----------
var options = { // 設定 };
function success(pos) {
  // 位置情報を使った処理
}
function error(err) {}

// 関数を渡している
navigator.geolocation.getCurrentPosition(success, error, options);
/B.----------
*/
/***** /関数の説明 *****/
