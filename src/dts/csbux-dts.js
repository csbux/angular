/**
 * @ngdoc overview
 * @name csbux.directives.dts
 *
 * @description
 * AngularJS version of a custom dynamic tab directive.
 */
'use strict'
var module = angular.module('csbux.directives.dts', []);


/**
 * @ngdoc directive
 * @name csbux.directives.dts:dtsDraggable
 * @restrict A
 *
 * @description
 * This directive provides HTML5 drag behaviour if set to true
 *
 *
 * @example
<a href="{{tab.title}}" ng-click="" ng-show="tabs.length > 1" class="iconSeparator" dts-draggable="true" data-dtsId="{{$index}}" ng-hide="tab.isPlaceholder">
	<span class="glyphicon glyphicon-transfer"></span>										
</a>
 */
module.directive('dtsDraggable', ['$rootScope', function($rootScope) {
	return {
		restrict: 'A',
		link: function(scope, el, attrs, controller) {			
			angular.element(document).ready(function () {				
				angular.element(el).attr("draggable", "true");

				el.bind("dragstart", function(e) {
					//get the ID of the tab being moved		
					//Firefox workaround due to dragstart event not firing when drag component is a child of a link - which is always the case with the AngularUI Bootstrap component
					//see http://forums.mozillazine.org/viewtopic.php?f=25&t=2822531 and http://stackoverflow.com/questions/23184362/firefox-dragstart-event-doesn-t-fire-in-hyperlink-s-children					
					e.dataTransfer.effectAllowed = "move";
					var dtsId = angular.element(el).attr("data-dtsId");
					e.dataTransfer.setData('dragId', dtsId);
					localStorage["dtsDragId"] = dtsId;									

					$rootScope.$emit("DTS-START-DRAG");					
				});


				el.bind("dragend", function(e) {
					$rootScope.$emit("DTS-END-DRAG");
				});
			});    
		}
	}
}]);

/**
 * @ngdoc directive
 * @name csbux.directives.dts:dtsDropObject
 * @restrict A
 *
 * @description
 * This directive provides HTML5 drop behaviour if set to true
 *
 * @param {function=} onDrag Provide callback function for ondragevent.
 *
 * @example
<div dts-drop-object="true" x-on-drag="dragged(dragEl, dropEl)" data-dtsId="{{$index}}" class="inlineDiv">
	<span>{{tab.title}}</span>											
</div>
 */
module.directive('dtsDropObject', ['$rootScope', function($rootScope) {
	return {
		restrict: 'A',
		scope: {			
			onDrag: '&'
		},
		link: function(scope, el, attrs, controller) {
			angular.element(document).ready(function () {
				$rootScope.enteredTabId = null;				

				el.bind("dragover", function(e) {
					if (e.preventDefault) {
						e.preventDefault(); 
					}

					
					return false;
				});

				el.bind("dragenter", function(e) {	
					if (e.preventDefault) {
						e.preventDefault();
					}

					if (e.stopPropagation) {
						e.stopPropagation();
					}

					//if directly on the drop div
					var newId = angular.element(e.target).attr("data-dtsId");

					//if on the plus span (add tab)
					if(!newId) {
						newId = angular.element(e.target).parent().attr("data-dtsId");
					}

					//if on the tab title (any other tab)
					if(!newId) {
						newId = angular.element(e.target).parent().attr("data-dtsId");
					}

					//DnD data not available in dragenter/dragleave/etc due to protected mode so we need to use the HTML5 Local Storage API
					//see http://stackoverflow.com/questions/11927309/html5-dnd-datatransfer-setdata-or-getdata-not-working-in-every-browser-except-fi

					if(newId && newId != $rootScope.enteredTabId && newId != localStorage["dtsDragId"]) {
						$rootScope.enteredTabId = newId;								
						scope.onDrag({dragEl: localStorage["dtsDragId"], dropEl: $rootScope.enteredTabId});		                
					}
				});

				el.bind("dragleave", function(e) {
					
				});

				el.bind("drop", function(e) {
					if (e.preventDefault) {
						e.preventDefault();
					}

					if (e.stopPropagation) {
						e.stopPropagation();
					}

					$rootScope.$emit("DTS-END-DRAG");
				});

				$rootScope.$on("DTS-START-DRAG", function() {		       		            	         
					angular.element(el).addClass("dts-target");
				});

				$rootScope.$on("DTS-END-DRAG", function() {		            	
					angular.element(el).removeClass("dts-target");					
				});
			});
}
}
}]);

module.controller('ModalInstanceCtrl', ['$scope', '$modalInstance', 'tabs', 'newTab', 'selectedTab', function($scope, $modalInstance, tabs, newTab, selectedTab){ 
	if(newTab) {
		$scope.shortenedId = "Bogus text";
		$scope.defaultName = 'Tab-' + $scope.shortenedId;
		$scope.defaultContent = 'content-' + $scope.shortenedId;
	} else  {
		$scope.defaultName = selectedTab.title;
		$scope.defaultContent = selectedTab.content;
	}

	$scope.tab = {name:$scope.defaultName,content:$scope.defaultContent};   

	$scope.ok = function (tab) {
		$modalInstance.close(tab);
	};

	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};
}]);


/**
 * @ngdoc directive
 * @name csbux.directives.dts:csbuxDts
 * @restrict E
 *
 * @description
 * This directive builds and operates the tab structure
 *
 * @param {array=} tabs Provide data structure behind the tabs.
 *
 * @example
<div ng-controller="MainCtrl">
	<csbux-dts dts="tabsSample"></csbux-dts>
</div>
 */
module.directive('csbuxDts', ['$sce', '$modal', function($sce, $modal) {
	return {
		restrict: 'E',		
		scope: {
			tabs: '=dts'
		},
		controller: function($scope) {

			$scope.dragged = function(dragEl, dropEl) {       
				$scope.dragEl = dragEl;
				$scope.dropEl = dropEl;

				$scope.$apply(function () {
					$scope.dragTabOrder = $scope.tabs[$scope.dragEl].order;

					$scope.tabs[$scope.dragEl].order = $scope.tabs[$scope.dropEl].order;
					$scope.tabs[$scope.dropEl].order = $scope.dragTabOrder;
					localStorage["dtsDragId"] = parseInt(localStorage["dtsDragId"]) + parseInt($scope.dropEl)-parseInt($scope.dragEl);
					
					angular.forEach($scope.tabs, function(tab, index) {                         
						tab.active = false;
						if(tab.order == $scope.tabs[$scope.dragEl].order) {
							tab.active = true;
						}
					});

					$scope.tabs.sort(function(tabA, tabB) {
						return tabA.order - tabB.order;
					});
				});
			};

			$scope.addTab = function() {
				$scope.selectedTabIndex = -1;

				angular.forEach($scope.tabs, function(tab, index) {
					if(tab.active) {
						$scope.selectedTabIndex = index;
					}                         
				});

				$scope.newTab = true;

				setTimeout(function() {
					var modalInstance = $modal.open({
						animation: true,
						templateUrl: 'myModalContent.html',
						controller: 'ModalInstanceCtrl',
						size: '',
						resolve: {
							tabs: function () {
								return $scope.tabs;
							},
							newTab: function() {
								return $scope.newTab;
							},
							selectedTab: function() {
								return null;
							}
						}
					});

					modalInstance.result.then(function (tab) {
						$scope.addActive = false;
						angular.forEach($scope.tabs, function(tab) {                          
							tab.active = false;                         
						});

						$scope.order = $scope.tabs.length;

						$scope.tabs.push({title: tab.name, content: tab.content, active:true,toRemove:false,toEdit:false,order:$scope.order});
					} , function(error) {
						$scope.addActive = false;                 
						angular.forEach($scope.tabs, function(tab) {                          
							tab.active = false;                         
						});

						$scope.tabs[$scope.selectedTabIndex].active = true;    
					});
				}); 
			};


			$scope.removeTab = function() {
				if($scope.tabs.length > 1) {
					$scope.selectedTabIndex = -1;

					angular.forEach($scope.tabs, function(tab, index) {                         
						if(tab.toRemove) {
							$scope.selectedTabIndex = index;            
						}                         
					});

					$scope.tabs[$scope.selectedTabIndex].active = false;
					$scope.tabs.splice($scope.selectedTabIndex,1);
					if($scope.selectedTabIndex == 0) {
						$scope.tabs[1].active = true; 
					} else {
						$scope.tabs[$scope.selectedTabIndex-1].active = true;
					}

			               //re-order
			               $scope.newOrder = 0;
			               angular.forEach($scope.tabs, function(tab, index) {                         
			               	tab.order = $scope.newOrder;
			               	$scope.newOrder++;
			        });
			    }
			};

	       $scope.editTab = function() {   
	       	$scope.selectedTabIndex = -1;

	       	angular.forEach($scope.tabs, function(tab, index) {                         
	       		if(tab.toEdit) {
	       			$scope.selectedTabIndex = index;
	       			tab.toEdit = false;         
	       		}                         
	       	});

	       	$scope.newTab = false;    
	       	$scope.selectedTab = $scope.tabs[$scope.selectedTabIndex];

	       	setTimeout(function() {
	       		var modalInstance = $modal.open({
	       			templateUrl: 'myModalContent.html',
	       			controller: 'ModalInstanceCtrl',
	       			size: '',
	       			resolve: {
	       				tabs: function () {
	       					return $scope.tabs;
	       				},
	       				newTab: function() {
	       					return $scope.newTab;
	       				},
	       				selectedTab: function() {
	       					return $scope.selectedTab;
	       				}
	       			}
	       		});

	       		modalInstance.result.then(function (tab) {
	       			$scope.selectedTab.title = tab.name;
	       			$scope.selectedTab.content = tab.content;
	       		} , function(error) {
	                   //log error
	               });
	       	}); 
	       };

   },      
   templateUrl: 'templates/dts/csbux-dts-template.html'
};

}]);