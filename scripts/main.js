// main.js
// firebase周りの処理を記載するファイル

/***** 関数構造の説明を最下部に記載 *****/

// Dokomaファンクションの初期化
function Dokoma () {
  this.checkSetup();

  // 要素を追加
  this.userPic = document.getElementById('user-pic');
  this.userName = document.getElementById('user-name');
  this.signInButton = document.getElementById('sign-in');
  this.signOutButton = document.getElementById('sign-out');
  this.signInSnackbar = document.getElementById('must-signin-snackbar');

  // 関数をボタンにバインド
  this.signOutButton.addEventListener('click', this.signOut.bind(this));
  this.signInButton.addEventListener('click', this.signIn.bind(this));

  this.initFirebase();

}

// Firebaseの設定
Dokoma.prototype.initFirebase = function () {
  console.log('initFirebase');
  // DB接続
  this.firestore = firebase.firestore();

  // 認証
  this.auth = firebase.auth();
  this.auth.onAuthStateChanged(this.onAuthStateChanged.bind(this));
};

// 現在ログインしているユーザのピンを消去する
Dokoma.prototype.deleteMarker = function (deleteData) {
  console.log('deleteMarker');

  console.log(deleteData);
  deleteDocName = deleteData['name'];
  this.firestore.collection("userMarker").doc(deleteDocName).delete().then(function () {
    console.log("Document successfully deleted!");
  }).catch(function (error) {
    console.error("Error removing document: ", error);
  });
}

// fasestoreに位置情報を登録する
Dokoma.prototype.insertMarker = function (saveData) {
  console.log('insertMarker');
  // 書き込み

  console.log(saveData);

  if (saveData) {
    this.firestore.collection('userMarker').doc(saveData).add({
      name: saveData['name'],
      lat: saveData['lat'],
      lng: saveData['lng'],
      time: saveData['time']
    })
    .catch(function(error) {
      console.error("Error adding document: ", error);
    });
  } else {
      console.warn('savedata is null');
  }
}


// 保存されているマーカー情報を全て返す
Dokoma.prototype.getMarkerAll = function () {
  console.log('getMarkerAll');

  markers = db.collection("userMarker").where("name", "==", true).get();
  return markers;
}


// サインイン、サインアウト時にトリガ
Dokoma.prototype.onAuthStateChanged = function (user) {
  console.log('onAuthStateChanged');

  console.log(user);
  if (user) {
    // ログイン時処理
    this.userName.textContent = user.displayName;
    this.userPic.removeAttribute('hidden');
    this.userName.removeAttribute('hidden');
    // サインインボタン非表示
    this.signInButton.setAttribute('hidden', 'true');
    // サインアウトボタン表示
    this.signOutButton.removeAttribute('hidden');

  } else {
    // ログアウト時処理
    this.userPic.setAttribute('hidden', 'true');
    this.userName.setAttribute('hidden', 'true');
    // サインインボタン表示
    this.signInButton.removeAttribute('hidden');
    // サインアウトボタン非表示
    this.signOutButton.setAttribute('hidden', 'true');

    // ログイン画面に遷移
    window.location.href = './login.html';
  }
};

// Firebase SDKの動作チェック
Dokoma.prototype.checkSetup = function () {
  console.log('checkSetup');
  if (!window.firebase || !(firebase.app instanceof Function) || !firebase.app().options) {
    window.alert('Firebase SDKが正常に動いていません。');
  }

};

// サインイン
Dokoma.prototype.signIn = function () {
  console.log('sign-in');
  var provider = new firebase.auth.GoogleAuthProvider();
  this.auth.signInWithPopup(provider);
};

// サインアウト
Dokoma.prototype.signOut = function () {
  console.log('sign-out');
  this.auth.signOut();
};


window.onload = function () {
  // Dokomaの初期化
  dokoma = new Dokoma();
  dokomaMapapi = new DokomaMapapi();
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
