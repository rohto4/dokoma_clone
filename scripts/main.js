// main.js
// firebase周りの処理を記載するファイル
// 'use strict';

/***** 関数構造の説明を最下部に記載 *****/

// Dokomaファンクションの初期化
function Dokoma() {
  this.checkSetup();
  this.initFirebase();
  setMyMarker();
}

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
  } else {
      console.warn('savedata is null');
  }
}

// サインイン、サインアウト時にトリガ
Dokoma.prototype.onAuthStateChanged = function(user) {
  if (user) {
    var userName = user.displayName;
    this.userName.textContent = userName;
  }
};

// Firebase SDKの動作チェック
Dokoma.prototype.checkSetup = function() {
  if (!window.firebase || !(firebase.app instanceof Function) || !firebase.app().options) {
    window.alert('Firebase SDKが正常に動いていません。firebase serveを実行してコードラボの実行を確認してください。');
  }
};

// Firebaseの設定
Dokoma.prototype.initFirebase = function() {
  // ★DB接続
  this.firestore = firebase.firestore();

  // ★認証
  this.auth = firebase.auth();
  this.auth.onAuthStateChanged(this.onAuthStateChanged.bind(this));
};

window.onload = function() {
  // Dokomaの初期化
  window.dokoma = new Dokoma();
};


/***** 関数の説明 *****/

/*
// Dokomaファンクションを定義
function Dokoma() {
  // いわゆるmain部分として扱っている
  this.         = Dokoma
  setMyMarker() = mapapi.jsに裸で定義してある関数(手抜き)
}

// Dokoma.ファンクションに処理(prototype)を追加
// × 必要な関数分
Dokoma.prototype.処理名 = function(value) {
  // 処理
}

// window.onloadをトリガにDokomaが生成されるよう設定する
// 外部ファイルからは
// dokoma.処理名();
// で、Dokomaオブジェクトの処理を呼び出し可能
window.onload = function() {
  window.dokoma = new Dokoma();
}
*/
