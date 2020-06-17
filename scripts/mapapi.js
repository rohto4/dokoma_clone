// mapapi.js

/***** 関数構造の説明を最下部に記載 *****/

var map; // 描画用マップオブジェクト
var userName;
var myLatLng;
// [0]:自分 [1]:その他
var markerData = [{}]; // マーカーの基となる情報
var marker = [{}]; // マーカーオブジェクト（ピン）
var infoWindow = [{}]; // 吹き出し

function DokomaMapapi () {
  this.initFirebase();
  this.initMap();
}

// マップの初期化
// 関連した関数を呼び出す
DokomaMapapi.prototype.initMap = function () {
  console.log('initMap');
  // My位置情報取得
  this.setMyData();

  // 地図生成、描画
  this.createMap();

  // My吹き出しの設定
  this.setMyInfoWindow();
  // Firestoreに登録済みのMyデータを更新
  this.updateMyMarkerData();

  // 全登録済み位置情報の取得 main.jsを使用
  this.setMembersData();
  // 全マーカーの設定
  this.setMembersMarker();
  // 全吹き出しの設定
  this.setMembersInfoWindow();

}

// 位置情報を取得し、広域変数に設定する
DokomaMapapi.prototype.setMyData = function () {
  console.log('setMyData');

  function success (pos) {
    myData = pos.coords;
    markerData[0]['lat'] = myData.latitude;  // 緯度
    markerData[0]['lng'] = myData.longitude; // 経度
    // 位置情報を生成
    myLatLng = new google.maps.LatLng(markerData[0]['lat'], markerData[0]['lng']); // 地図の中心座標
  }
  // 位置情報の取得に失敗した場合の処理
  function error (err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }
  // ブラウザを通して位置情報を取得
  // option省略
  navigator.geolocation.getCurrentPosition(success, error);
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

// 自分のマーカーオブジェクトを設定
DokomaMapapi.prototype.setMyMarkar = function () {
  console.log('setMyMarkar');

  // マーカーオブジェクトを生成
  marker[0] = new google.maps.Marker({
    zoom: 15,
    position: myLatLng,
    map: map
  });
}


// firestoreに登録済みの吹き出し情報を読み込み、広域変数に格納
DokomaMapapi.prototype.setMyInfoWindow = function () {
  console.log('setMyInfoWindow');

  // 日時取得
  var date = new Date();
  // 吹き出し情報を設定
  var hourStr = ('0' + date.getHours()).slice(-2);  // 頭に"0"を付けて、下2桁を切り取り
  var minStr = ('0' + date.getMinutes()).slice(-2); // 同上
  var markTime = hourStr + ":" + minStr;

  var content = "[" + markTime + "] " + this.userName;

  // ピンオブジェクトを格納
  infoWindow[0] = new google.maps.InfoWindow({
    content: content
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

// firestoreの自分の位置情報をアップデート
// firestore操作部分はmain.jsに投げる
DokomaMapapi.prototype.updateMyMarkerData = function () {
  console.log('updateMyMarkerData');
  // 既に自分の位置がfirestoreに登録されていれば削除
  var deleteData = {
    'name': userName
  }
  this.dokoma.deleteMarker(deleteData);

  // 新しい自分の位置をfirestoreに登録
  var saveData = {
    'name': userName,
    'lat': markerData[0]['lat'],
    'lng': markerData[0]['lng'],
    'time': markTime
  };
  this.dokoma.insertMarker(saveData);
}

// Firestoreから登録済み位置情報を読み込み、広域変数に格納
DokomaMapapi.prototype.setMembersData = function () {
  console.log('setMembersData');
  // firestore
  var tmpMarkerData = dokoma.getMembersData();

  // 全てのデータをMarkerDataの[1]以降に移し替える
  for (i = 1; tmpMarkerData.indexOf([i - 1]); i++) {
    markerData[i] = tmpMarkerData[i - 1];
  }
  var readMessage = '登録済み位置情報[' + (i - 1).toString() + ']件読み込み';
  console.log(readMessage);
}

// 登録済み位置情報をマーカーオブジェクトに変換
DokomaMapapi.prototype.setMembersMarker = function () {
  console.log('setMembersMarker');

  // firestoreから取得した位置情報の数だけループ
  for (j = 1; markerData.indexOf(j); j++) {
    memberLatLng = new google.maps.LatLng(markerData[j]['lat'], markerData[j]['lng']);
    // マーカーオブジェクトを生成、格納
    marker[j] = new google.maps.Marker({
      position: memberLatLng,
      map: map
    });
  }
}

// 登録済みマーカーの吹き出し設定
DokomaMapapi.prototype.setMembersInfoWindow = function () {
  console.log('setMembersInfoWindow');

  // マーカーオブジェクトの数だけループ
  for (k = 1; markerData.indexOf(k); k++) {
    var memberInfoTxt = "[" + markerData[k]['time'] + "] " + markerData[k]['name'] + " さん";
    // ピンオブジェクトを生成、格納
    infoWindow[k] = new google.maps.InfoWindow({
      content: memberInfoTxt
    });
  }
}

// Firebaseの設定
DokomaMapapi.prototype.initFirebase = function () {
  console.log('initFirebase');
  // DB接続
  this.firestore = firebase.firestore();

  // 認証
  this.auth = firebase.auth();
  this.auth.onAuthStateChanged(this.onAuthStateChanged.bind(this));
};

// サインイン、サインアウト時にトリガ
DokomaMapapi.prototype.onAuthStateChanged = function (user) {
  console.log('onAuthStateChanged');

  if (user) {
    // ログイン時処理
    this.userName = user.displayName;
  }
};

// window.onload = function () {
//   this.dokomaMapapi = new DokomaMapapi();
//   this.dokoma = new Dokoma();
// };


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
