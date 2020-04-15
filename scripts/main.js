// main.js
'use strict';

// Initializes Dokoma.
function Dokoma() {
  this.checkSetup();
  this.initFirebase();
  method1();
}

/*
Dokoma.prototype.map = function(e) {
  e.preventDefault();
}
*/


// 現在地を設定した時、fasebaseに情報を登録する
Dokoma.prototype.saveMarker = function(savedata) {
  // ★DB書き込み
  if (savedata) {
    this.firestore.collection('userMarker').add({
      name: savedata['name'],
      lat: savedata['lat'],
      lng: savedata['lng'],
      time: savedata['time']
    })
    .catch(function(error) {
      console.error("Error adding document: ", error);
    });
  }
}


// サインイン、サインアウト時にトリガ
Dokoma.prototype.onAuthStateChanged = function(user) {
  if (user) {
    var userName = user.displayName;
    this.userName.textContent = userName;
  }
};

/*
// Mapを表示
Dokoma.prototype.displayMap = function(key, name, locate_ido, locate_kdo) {
  var div = document.getElementById(key);
  div.querySelector('#map').textContent = myMap;
};
*/

// Firebase SDKの動作チェック
Dokoma.prototype.checkSetup = function() {
  if (!window.firebase || !(firebase.app instanceof Function) || !firebase.app().options) {
    window.alert('You have not configured and imported the Firebase SDK. ' +
      'Make sure you go through the codelab setup instructions and make ' +
      'sure you are running the codelab using `firebase serve`');
  }
};

// Firebaseの設定
Dokoma.prototype.initFirebase = function() {
  // ★DB接続
  this.firestore = firebase.firestore();
//   Dokoma.firestore = firebase.firestore();

  // ★認証
  this.auth = firebase.auth();
  this.auth.onAuthStateChanged(this.onAuthStateChanged.bind(this));
};

window.onload = function() {
  // Initializes Dokoma.
  window.dokoma = new Dokoma();
};
