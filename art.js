(function() {
    var url = location.href;
    var linkEle = document.getElementById("js-link");
    var baseUrl = "http://127.0.0.1:5500/web-01.html";
    var dpShopIds = {
      "shop-a" : "SP1",
      "shop-b" : "SP2",
      "shop-c" : "SP3",
      "shop-d" : "SP4",
      "shop-e" : "SP5",
      "shop-f" : "SP6"
    };
  
    var shop = location.href.replace(/https{0,1}:\/\/[^\/]+\/([^\/]+).*/, "$1");
    if (shop in dpShopIds) {
      linkEle.href = baseUrl + dpShopIds[shop];
      return;
    }
    else if (location.href.indexOf("test2.com") >= 0) {
      linkEle.href = baseUrl + dpBranchIds["shop-f"];
      return;
    }
  })();