// main.js
'use strict';

// Initializes Dokoma.
function Dokoma() {
  this.checkSetup();
  this.initFirebase();
}

// Firebaseの設定
Dokoma.prototype.initFirebase = function() {
  // ★DB接続
  this.firestore = firebase.firestore();

  // ★認証
  this.auth = firebase.auth();
  this.auth.onAuthStateChanged(this.onAuthStateChanged.bind(this));
};

Dokoma.prototype.map = function(e) {
  e.preventDefault();
}

// 現在地を設定した時、fasebaseに情報を登録する
Dokoma.prototype.saveLocation = function(e) {
  // ★DB書き込み
  if (this.mapInput.value) {
    this.firestore.collection('map').add({
      name: "User Name",
      locate_ido: this.locate_ido.value,
      locate_kdo: this.locate_kdo.value,
      timestamp: new Date()
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

// Displays a Map UI.
Dokoma.prototype.displayMap = function(key, name, locate_ido, locate_kdo) {
  var div = document.getElementById(key);
  div.querySelector('#map').textContent = myMap;

};

// Firebase SDKの動作チェック
Dokoma.prototype.checkSetup = function() {
  if (!window.firebase || !(firebase.app instanceof Function) || !firebase.app().options) {
    window.alert('You have not configured and imported the Firebase SDK. ' +
      'Make sure you go through the codelab setup instructions and make ' +
      'sure you are running the codelab using `firebase serve`');
  }
};

window.onload = function() {
  // Initializes Dokoma.
  window.easyChat = new Dokoma();
};
