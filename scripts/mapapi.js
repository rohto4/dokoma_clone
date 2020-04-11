// 初期地図の設定
function initMap() {
    print('initMap');

    initIdo = "32.6811673";
    initKdo = "138.7670516";
    initMapType = "roadmap";
        // 初期地点の設定
    var initMarker = new google.maps.LatLng(initIdo, initKdo);　// デフォルトの中心座標
    var initOption = {
        zoom: 15,              // 縮尺値
        center: initMarker,    // 中心座標
        mapTypeId: initMapType // 種類
    };
    // 地図描画
    var dispMap = new google.maps.Map(document.getElementById('map'), initOption);

}

function latestMyMerkar() {
    print('latestMyMerkar');
    // 現在地取得
    myIdo = "138.715802";
    myKdo = "32.766500";
    // 現在地の設定
    var myMarker = new google.maps.Marker({
        zoom: 30,              // ズームする
        position: new google.maps.LatLng(myIdo, myKdo),　//ピンを立てる経度緯度情報
        map:dispMap            // 描画
    });
    // 吹き出し処理
    var myInfoWindow = new google.maps.InfoWindow({
        content: "アイエエエ！！！ニンジャ！？"　// コメント
    });

}

function getMembersMarker() {
    print('getMembersMarker');
}

// 吹き出しを開く
google.maps.event.addListener(myInfoWindow, "click", function() {
    print('click open');
    myInfoWindow.open(map, myMarker);
});

// 吹き出しクローズ時処理
google.maps.event.addListener(myInfoWindow, "closeclick", function() {
    print('click close');
    // クリックで開くよう再設定
    google.maps.event.addListenerOnce(myMarker, "click", function(event) {
        myInfoWindow.open(map, myMarker);
    });　
});
