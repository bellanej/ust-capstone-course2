// same as 'DOMContentLoaded, but for jQuery'
$(function() {

	$('#myCarousel').carousel({ interval: 2000});

});

(function(global) {

  // namespace for the global object
  var God = {};

  // variables for 
  var homeHtml = 'main-content.html';
  var mapHtml = 'map-content.html';
  var aboutHtml = 'about-content';
  var goodHtml = 'good-to-know-content.html';
  var eatListHtml = 'eat-list.html';
  var eatItem = 'eat-item.html';
  var eatData = 'data/eat-data.json'

  // convinience function for inserting innerHTML for 'select'
  // helps inserting html in selected elements
  var insertHtml = function(selector, html) {
    var targetElem = document.querySelector(selector);
    targetElem.innerHTML = html;
  };

  // returns substitute of '{{propName}}'
  // with propValue in given string
  var insertProperty = function(string, propName, propValue) {
    var propToReplace = '{{' + propName + '}}';
    string = string.replace(new RegExp(propToReplace, 'g'), propValue);
    return string;
  };

    // on page load (before images or css)
  document.addEventListener('DOMContentLoaded', function(event) {

    // on first load, show main-content-view
    loadHtml(homeHtml);
  });

  function loadHtml(page) {
    $ajaxUtils.sendGetRequest(page, function(responseText) {
      document.querySelector('#main-content').innerHTML = responseText;
    },
    false);
  }

  function loadEatItem(id) {
    // 1. get eat-data.json
    // 2. get eat-item.html
    // 3. find eat item with correct id in eat-data.json
    // 4. replace {{ values }} in eat-item.html with data from found eat item
    // 5. insert html into main-content

    $ajaxUtils.sendGetRequest(eatData, function(eatListData) {
      eatListData = JSON.parse(eatListData);
      $ajaxUtils.sendGetRequest(eatItem, function(html) {
        var foundItem = null;
        for(var i = 0; i < eatListData.length; i++) {
          var item = eatListData[i];

          if(item.id == id) {
            foundItem = item;
            break;
          }
        }

        html = insertProperty(html, 'name', foundItem.name);
        html = insertProperty(html, 'price', foundItem.price);
        html = insertProperty(html, 'address', foundItem.address);
        html = insertProperty(html, 'description', foundItem.description);
        html = insertProperty(html, 'homepage', foundItem.homepage);

        insertHtml('#main-content', html);

      },
      false);
    },
    false);
  }

  God.loadHtml = loadHtml;
  God.loadEatItem = loadEatItem;

  global.$God = God;

})(window);