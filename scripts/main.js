// main.js
'use strict';

// Initializes Dokoma.
function Dokoma() {
  this.checkSetup();

  // Shortcuts to DOM Elements.
  this.map = document.getElementById('map');
  this.locate_ido = document.getElementById('locate-Ido');
  this.locate_kdo = document.getElementById('locate-Kdo');
  this.userName = document.getElementById('user-name');
  this.timestamp = document.getElementById('timestamp');

  this.initFirebase();
}

// Sets up Firebase features.
Dokoma.prototype.initFirebase = function() {
  // TODO : 08. firestoreから読み込み  ★　DB接続
  this.firestore = firebase.firestore();

  // TODO : 12. 認証を追加　★
  this.auth = firebase.auth();
  this.auth.onAuthStateChanged(this.onAuthStateChanged.bind(this));
};

Dokoma.prototype.map = function(e) {
  e.preventDefault();

}
// Saves a new message on the Firestore.
Dokoma.prototype.saveMessage = function(e) {

  // TODO : 09. 送信時のFirestore保存処理を追加　★　☆　DB書き込み
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

    Dokoma.resetMaterialTextfield(this.messageInput);
    this.toggleButton();
  }
};

// Triggers when the auth state change for instance when the user signs-in or signs-out.
Dokoma.prototype.onAuthStateChanged = function(user) {
  if (user) {
    var userName = user.displayName;
    this.userName.textContent = userName;
  }
};

// Resets the given MaterialTextField.
Dokoma.resetMaterialTextfield = function(element) {
  element.value = '';
  element.parentNode.MaterialTextfield.boundUpdateClassesHandler();
};

// Displays a Map UI.
Dokoma.prototype.displayMap = function(key, name, locate_ido, locate_kdo) {
  var div = document.getElementById(key);

  if (!div) {
    var container = document.createElement('div');
    div1 = container.firstChild;
    div2 = container.SecondChild;
    div3 = container.ThirdChild;
    div4 = container.forthChild;
    div1.setAttribute('id', key);
    div2.setAttribute('locate_ido', locate_ido;
    div3.setAttribute('locate_kdo', locate_kdo);
    div4.setAttribute('timestamp', timestamp);
    this.messageList.appendChild(div1);
    this.messageList.appendChild(div2);
    this.messageList.appendChild(div3);
    this.messageList.appendChild(div4);
  }
  div.querySelector('.name').textContent = name;

};

// Checks that the Firebase SDK has been correctly setup and configured.
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
