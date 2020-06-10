// login.js

// Initializes Dokoma.
function Dokoma () {
  this.checkSetup();

  // Shortcuts to DOM Elements.
  this.signInButton = document.getElementById('sign-in');
  this.signInSnackbar = document.getElementById('must-signin-snackbar');

  // Saves message on form submit.
  this.signInButton.addEventListener('click', this.signIn.bind(this));

  this.initFirebase();
}

// Firebaseに機能を追加する

//
Dokoma.prototype.initFirebase = function () {
  console.log('login.js');
  console.log('initFirebase');
  // 認証を追加
  this.auth = firebase.auth();
  this.auth.onAuthStateChanged(this.onAuthStateChanged.bind(this));
};

// Signs-in.
Dokoma.prototype.signIn = function () {
  console.log('login.js');
  console.log('sign-in');
  // サインインボタン
  var provider = new firebase.auth.GoogleAuthProvider();
  this.auth.signInWithPopup(provider);
};

// Triggers when the auth state change for instance when the user signs-in or signs-out.
Dokoma.prototype.onAuthStateChanged = function (user) {
  console.log('login.js');
  console.log('onAuthStateChanged');
  if (user) {
    // ログイン成功時にマップ画面に遷移
    window.location.href = './';
  }
};

// Checks that the Firebase SDK has been correctly setup and configured.
Dokoma.prototype.checkSetup = function () {
  console.log('login.js');
  console.log('checkSetup');
  if (!window.firebase || !(firebase.app instanceof Function) || !firebase.app().options) {
    window.alert('Firebase SDKが正常に動いていません。firebase serveを実行してコードラボの実行を確認してください。');
  }
};

window.onload = function () {
  // Initializes Dokoma.
  window.Dokoma = new Dokoma();
};
