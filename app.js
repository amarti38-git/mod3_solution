(function () {
    'use strict';

angular.module('NarrowItDownApp', [])
.controller('NarrowItDownController', NarrowItDownController )
.service('MenuSearchService', MenuSearchService)
.constant('ApiBasePath', "https://davids-restaurant.herokuapp.com")
.directive('foundItems', FoundItemsDirective);

function FoundItemsDirective() {
     var ddo = {
      templateUrl: 'foundItems.html',
      scope: {
        foundItems: '<',
        onRemove: '&'
      },
      controller: NarrowItDownController,
      controllerAs: 'menu',
      bindToController: true
    };
  
    return ddo;
}

NarrowItDownController.$inject = ['MenuSearchService'];
function NarrowItDownController(MenuSearchService) {
  var menu = this;
  menu.found = [];
  menu.searchTerm = "";

  menu.getMatchedMenuItems = function () {
    var promise = MenuSearchService.getMatchedMenuItems(menu.searchTerm);
    console.log(MenuSearchService.getMatchedMenuItems(menu.searchTerm));
    promise.then(function (response) {
      menu.found = response.data;
    })
    console.log(menu.found);
  };

  menu.removeItem = function (itemIndex) {
    menu.found.splice(itemIndex, 1);
  };
}

MenuSearchService.$inject = ['$http', 'ApiBasePath'];
function MenuSearchService($http, ApiBasePath) {
    var service = this;
    
    service.getMatchedMenuItems = function (searchTerm) {
      return $http({
        method: "GET",
        url: (ApiBasePath + "/menu_items.json")
      }).then(function (result) {
        // process result and only keep items that match
        var foundItems = [];
        if(searchTerm) {
          var items = result.data.menu_items;
          for(var i = 0; i < items.length; ++i){
            if(items[i].description.indexOf(searchTerm) != -1)
              foundItems.push(items[i]);
          }
        }
        // return processed items
        return foundItems;
      });
    };
}

})();