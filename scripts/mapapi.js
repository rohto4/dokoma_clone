// mapapi.js

/***** 関数構造の説明を最下部に記載 *****/

var map; // 描画用マップオブジェクト
var userName;
// [0]:自分 [1]:その他
var markerData = []; // マーカーの基となる情報
var marker = []; // マーカーオブジェクト（ピン）
var infoWindow = []; // 吹き出し

function DokomaMapapi () {
  userName = user.displayName // 認証済アカウントから名前を取得
  dokomaMapapi.initFirestore();
  dokomaMapapi.initMap();
}

// マップの初期化
// 関連した関数を呼び出す
DokomaMapapi.prototype.initMap = function () {
  console.log('initMap');
  // My位置情報取得
  dokomaMapapi.setMyMarkerData();
  // Myマーカーの設定
  dokomaMapapi.setMyMarker();
  // My吹き出しの設定
  dokomaMapapi.setMyInfoWindow();

  // 全登録済み位置情報の取得 firestoreクラスを使用
  dokomaMapapi.setMembersMarkerData();
  // 全マーカーの設定
  dokomaMapapi.setMembersMarker();
  // 全吹き出しの設定
  dokomaMapapi.setMembersInfoWindow();

  // 地図生成、描画
  dokomaMapapi.createMap();
}

// 位置情報を取得し、広域変数に設定する
DokomaMapapi.prototype.setMyMarkerData = function () {
  console.log('setMyMarkerData');

  function success (pos) {
    myData = pos.coords;
    markerData[0]['lat'] = myData.latitude;  // 緯度
    markerData[0]['lng'] = myData.longitude; // 経度
  }
  // 位置情報の取得に失敗した場合の処理
  function error (err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }
  // ブラウザを通して位置情報を取得
  // option省略
  navigator.geolocation.getCurrentPosition(success, error);
}


// 登録済マーカーを返す
DokomaMapapi.prototype.getMembersMarkerData = function () {
  console.log('getMembersMarkerData');
}

// マーカー情報を全て読み込み、格納する
DokomaMapapi.prototype.setMarkar = function () {
  console.log('setMarkar');

  // 位置情報を生成
  var myLatLng = new google.maps.LatLng(markerData[0]['lat'], markerData[0]['lng']); // 地図の中心座標
  // マーカーオブジェクトを生成
  marker[0] = new google.maps.Marker({
    position: myLatLng,
    map: map
  });

  // 自分の位置をfirestoreに登録
  // firebase処理クラス(main.js)に投げる
  var savedata = {
    'name': userName,
    'lat': markerData[0]['lat'],
    'lng': markerData[0]['lng'],
    'time': markTime
  };
  dokoma.saveMarker(savedata);
}


// firestoreに登録済みの吹き出し情報を読み込み、広域変数に格納する
DokomaMapapi.prototype.setInfoWindow = function () {
  console.log('setInfoWindow');

  // 日時取得
  var date = new Date();
  // 吹き出し情報を設定
  var hourStr = ('0' + date.getHours()).slice(-2);
  var minStr = ('0' + date.getMinutes()).slice(-2);
  var markTime = hourStr + ":" + minStr;

  var myContent = "[" + markTime + "] " + user.displayName + " さん";

  // ピンオブジェクトを格納
  infoWindow[0] = new google.maps.InfoWindow({
    content: myContent
  });
  // 吹き出しを開く
  infoWindow[0].open(map, marker[0]);

  // マーカー共通設定
  // 吹き出しが閉じられたら、マーカークリックで再び開くようにする
  google.maps.event.addListener(infoWindow[0], "closeclick", function () {
    google.maps.event.addListenerOnce(marker[0], "click", function (event) {
      infoWindow[0].open(map, marker[0]);
    });
  });
}


// 地図生成、描画
DokomaMapapi.prototype.createMap = function () {
  console.log('createMap');

  // オプション設定
  var mapOptions = {
    zoom: 15,             // 地図の縮尺値
    center: myLatLng,     // 地図の中心座標
    mapTypeId: 'roadmap'  // 地図の種類
  };
  // HTMLの地図埋め込みタグを取得
  dispMapArea = document.getElementById('map');
  // 地図生成、描画
  map = new google.maps.Map(dispMapArea, mapOptions);
}

// irestore初期化
DokomaMapapi.prototype.initFirestore = function () {
  console.log('initFirestore');
}


window.onload = function () {
  // MapAPIオブジェクトを初期化
  window.dokomaMapapi = new DokomaMapapi();
};


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
