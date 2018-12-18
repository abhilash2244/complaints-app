angular.module('starter.controllers')
.controller('mapController', ['$scope', '$ionicHistory', '$state', '$ionicPopup', '$window', '$rootScope', '$cordovaGeolocation', '$http', '$ionicLoading', 'leafletData', '$timeout', 'config', 'commonService', '$localstorage', 'mapService', 'alertService','$ionicModal','strings','setGetObj','mapComponentServices','$ionicSideMenuDelegate','$ionicPopover', function ($scope, $ionicHistory, $state, $ionicPopup, $window, $rootScope, $cordovaGeolocation, $http, $ionicLoading, leafletData, $timeout, config, commonService, $localstorage, mapService, alertService,$ionicModal,strings,setGetObj,mapComponentServices,$ionicSideMenuDelegate,$ionicPopover) {
			var _map;
			$scope.maprecordId = "";
			securityHeaders.headers = commonService.securityHeaders();

			leafletData.getMap().then(function (map) {
				_map = map;
			});
			//backppport form Ue by venki
			var cardedMarkers = new L.FeatureGroup();
			var nonCardedMarkers = new L.FeatureGroup();
			var lifteTimecardedMarkers = new L.FeatureGroup();
			var lifteTimenonCardedMarkers = new L.FeatureGroup();
			$scope.baseUrl = "https://myworld.tatapower.com/myworld/";
			$scope.layerControl = L.control.layers();

			$scope.typeOfSketching = "add";

		    $scope.totalDistance = 0;
		    $scope.lthMarkers = [];
			$scope.coord = [];
		    $scope.polylines = [];

			$rootScope.sketchingData = [];

			$scope.searchedItem = "Address";

			$scope.bufferSearchCenterLat; 
			$scope.bufferSearchCenterLng;
   		    $scope.selectedData = {
			    data: undefined
			};
			$scope.editGeomGeoJsonObjectLayer;
			$scope.interactionHandler;
			$scope.options;
			$scope.currentDrawLayer;
            $rootScope.drawnItems = new  L.FeatureGroup();

        	$scope.isDrawModeActivated = false;

            L.drawLocal.edit.handlers.edit.tooltip = {
                text: "",
                subtext: ""
            };
            L.drawLocal.draw.handlers.marker.tooltip.start = "";

            L.drawLocal.draw.handlers.polyline.tooltip = {
                start: "",
                cont: "",
                end: ""
            };

            L.drawLocal.draw.handlers.polygon.tooltip = {
                start: "",
                cont: "",
                end: ""
            };


		    $scope.dataToCopyInMapInteractionField = "";
		    $scope.customControlForSketchingTool;
			$scope.bufferSearchCheck = {value : false};
			$scope.homeViewCheck = {value : false};
			$scope.bookmarkCheck = {value : false};
			$scope.pointGeometryCheck = {value : false};
			$scope.lineGeometryCheck = {value : false};
			$scope.areaGeometryCheck = {value : false};
			$scope.measureToolCheck = {value : false};
			$scope.routeBetween2PointsCheck = {value : false};

			$scope.drawingMode = false;
			$scope.acordianCheck = {value : false};

			$rootScope.autocomplete = false;
			$rootScope.searchIcon = true;
			$rootScope.clearIcon = false;
			$scope.mapImage = {};
			$scope.mapImage = "img/Map.png";

			$scope.bufferDistanceCenterMarker;
			$scope.sourceForRouteBetween2Points;
			$scope.destinationForRouteBetween2Points;
			$scope.bufferDistanceCircle;
			$scope.osmBaseLayer;
			$scope.noneBaseLayer;
			$scope.tilelayer;
			$scope.layerCodes = [];
			$scope.listOfLayers;
			$scope.accessibleLayers = [];
			$scope.vectorLayer = null;
			$scope.previousData = null;
			$scope.currentFeature = false;
			$scope.modal;

			//backport form UE by venki
			$scope.arr = [];
			var addressSearchMarker;
			var marker;
			//backporting end
			$scope.navigatteTotask = function () {
				$state.transitionTo("app.taskforms");
			};
/*
@Developer : SKG
@Date : 3/5/2018
@Descrition : clearing the sorce and destination fields in map toll find route
*/			$scope.clearSource = function (searchType) {
				mapComponentServices.clearSource($scope);
			};

			$scope.getCurrentLocationAndSetToSource = function () {
				mapComponentServices.getCurrentLocationAndSetToSource($scope);
			};

			$scope.clearDestination = function (searchType) {
				mapComponentServices.clearDestination($scope);
			};
			$scope.searchType = function (searchType) {
				mapComponentServices.toggleSearchType($scope);
			};

			$scope.toggleToAddress = function () {
				mapComponentServices.toggleToAddress($scope);
			};

			$scope.toggleToAsset = function () {
				mapComponentServices.toggleToAsset($scope);
			};

		    $scope.gotoSelection = function(value) {
		    	mapComponentServices.gotoSelection($scope,value);
		    }
		    $scope.searchData = function(selected) {
		    	mapComponentServices.searchData($scope,selected);
		    }
			$scope.init = function () {
				$scope.isSketchingEnabled = commonService.getSketchingStatus();
				var height = $window.innerHeight-43;
				$scope.MapHeight = height; // leaves the header padding
				$scope.DivWid = $window.innerWidth;

				if ($rootScope.NavigatedFrom == "tasks" || $rootScope.NavigatedFrom == "jobs") {
					$scope.createTaskMarkers();
				}
				if ($rootScope.NavigatedFrom == "form") {}
				if ($rootScope.NavigatedFrom == "prepoprec") {
					$scope.createTaskMarkers();
				}

			};
			/*
			This funciton is used to make a marker, that is later added to the map
			1. prepare the message that should be displayed when clicked on a marker
			2. prepare the object that should be returned
			 */
			$scope.makeMarker = function (lat, lng, recid, formid) {
				return {
					lat : parseFloat(lat),
					lng : parseFloat(lng),
					clickable : true,
					recid : recid,
					formid : formid

				};
			};
			/**
	         * @param{Map Event}
	         * @desc 
	            called when click on map  
	         * @author Santhosh Kumar Gunti
         	*/
			function onMapClick(e) {
				mapComponentServices.onMapClick(e,$scope)
			}
			
			//backport form Ue by venki
			function createMarkersProcess(geometer, record, formId, taskId, markerIcon, markerLayer, type) {
				var customMarker = L.Marker.extend({});
				var markerObject = new customMarker([geometer.lat, geometer.long], {
						recordId: record.recordId,
						icon: markerIcon,
						FormId: formId,
						TaskId: taskId
					});
				var marker = L.marker(L.latLng(geometer.lat, geometer.long));
				$scope.arr.push(marker);

				if ($rootScope.NavigatedFrom == "prepoprec") {
					$scope.clickedLat = "";
					$scope.clickedLng = "";
					angular.forEach($scope.tasklist, function (record, key) {
						if (record.recordId == $rootScope.navigatetoRecordId) {
							$scope.clickedLat = record.lat;
							$scope.clickedLng = record.long;
							$scope.maprecordId = record.recordId;
//							$scope.navigateToLocation();
						} else {
							//		console.log("..............");
						}
					});

				} else {
					markerObject.on('click', function () {
						if (type) {
							$scope.openMenu();
							$rootScope.$broadcast('ViewTaskFormRecordTask', markerObject.options);

//							$rootScope.ViewTaskFormRecord(markerObject.options);
						} else {
							$scope.openMenu();
							$rootScope.$broadcast('getPrePoprecordFromMapTask', markerObject.options);
//							$rootScope.getPrePoprecordFromMap(markerObject.options);
						}
					})
					markerObject.addTo(markerLayer);
				}
			}

			//backport form Ue by venki
			function createMarkersProcessProjectTask(geometer, record, formId, taskId, markerIcon, markerLayer, type,key) {
				var customMarker = L.Marker.extend({});
				var markerObject = new customMarker([geometer[0], geometer[1]], {
						record: record,
						icon: markerIcon,
						FormId: formId,
						TaskId: taskId
					});
				var marker = L.marker(L.latLng(geometer[0], geometer[1]));
				$scope.arr.push(marker);

				if ($rootScope.NavigatedFrom == "prepoprec") {
					$scope.clickedLat = "";
					$scope.clickedLng = "";
					angular.forEach($scope.tasklist, function (record, key) {
						if (record.RUID == $rootScope.navigatetoRecordId) {
							$scope.clickedLat = record.lat;
							$scope.clickedLng = record.long;
							$scope.maprecordId = record.RUID;
						} else {
							//		console.log("..............");
						}
					});

				} else {
					markerObject.on('click', function () {
						if (type) {
							$scope.openMenu();
							$rootScope.$broadcast('ViewTaskFormRecordProjectTask', markerObject.options,key);
//							$rootScope.ViewTaskFormRecord(markerObject.options);
						} else {
							$rootScope.$broadcast('getPrePoprecordFromMapProjectTask', markerObject.options,key);
//							$rootScope.getPrePoprecordFromMap(markerObject.options);
						}
					})
					markerObject.addTo(markerLayer);
				}
			}

			$scope.navigateToLocation = function () {
			if($scope.clickedLat != "" && $scope.clickedLat != ""){	
//				commonService.LoaderShow(strings.pleasewait);
				if ($rootScope.NavigatedFrom == "prepoprec") {
				
					if ($scope.control != undefined) {
						_map.removeControl($scope.control);
					}
					commonService.getLatLong(function (geoLocation) {
						if (geoLocation.netstatus == "success") {
							$scope.lat = geoLocation.latlong[0];
							$scope.long = geoLocation.latlong[1];
							$rootScope.waypoints = [
								L.latLng($scope.lat, $scope.long),
								L.latLng($scope.clickedLat, $scope.clickedLng)
							];
							$scope.control = L.Routing.control({
									plan: L.Routing.plan($rootScope.waypoints, {
										createMarker: function (i, wp) {
											var maplat = wp.latLng.lat;
											var maplng = wp.latLng.lng;
											return L.marker(wp.latLng, {
												draggable: false,
												icon: L.icon.glyph({
													glyphColor: 'red',
													glyph: String.fromCharCode(65 + i),
													bgSize: [800, 100]
												})
												/*icon: L.icon({iconUrl: 'img/blue.png',
												iconSize:     [50, 50], // size of the icon
												})*/
											}).on('click', function (e) {
												var latLongClick = e.target._latlng;
												if (latLongClick.lat == $scope.lat && latLongClick.lng == $scope.long) {
													

												} else {
													var url = "http://maps.google.com?q=" + maplat + "," + maplng;
													window.open(url, "_system", 'location=yes');
												}
											});
										},

									}),
									altLineOptions: {
										styles: [{
												color: 'black',
												opacity: 0.15,
												weight: 9
											}, {
												color: 'white',
												opacity: 0.8,
												weight: 6
											}, {
												color: 'blue',
												opacity: 0.5,
												weight: 2
											}
										]
									}
								})
								.addTo(_map);
		//						L.Routing.errorControl($scope.control).addTo(_map);
							$scope.navigationStatus = true;
		//						commonService.Loaderhide();
							$scope.gotToCurrentLocation();
						}
						if (geoLocation.netstatus == "error") {
							commonService.Loaderhide();
							console.log("this is 8633333333333333333333333")
							alertService.showToast(geoLocation.message);
						}
					});
				}
			}
			else{
				alertService.showToast("Can't navigate to non-prepop data");
			}
			};
			$scope.gotToCurrentLocation = function () {
				var that = this;
				var options = {
					enableHighAccuracy: true,
					timeout: 5000,
					maximumAge: 0
				};
			}
			$scope.createProjectTaskMarkers = function () {
				var taskId = commonService.getSelectedTaksId();
				var formId = commonService.getSelectedFormId();
				var user = $localstorage.getObject("username");

				var greenMarkerIcon = L.icon({
						iconUrl: 'img/green.png',
						iconSize: [30, 30], // size of the icon
					});
				var blueMarkerIcon = L.icon({
						iconUrl: 'img/blue.png',
						iconSize: [30, 30], // size of the icon
					});

				var url = config.url + "/api/v1/projectProcesss/getMarkers/" + taskId + "/" + formId + "/" + user + "";
				mapService.getMapRecords(url, securityHeaders, function (response, status) {
					console.log(response);
					$scope.tasklist = [];
					if (response.status == 204) {
						alertService.doAlert(response.message);
					}
					if (response.status == 200) {
						angular.forEach(response.data.latlngData, function (value, key) {
							angular.forEach(value.records, function (record, key) {
									if(record.geometries[0] != undefined && record.geometries[0] != "" && record.geometries[1] != undefined && record.geometries[1] != ""){
										$scope.tasklist.push({
											lat: record.geometries[0],
											long: record.geometries[1],
											recordId: record.recordId,
											formId: value.formId,
											RUID:record.RUID
										});
										if (record.status) {
											createMarkersProcessProjectTask(record.geometries, record, value.formId, taskId, greenMarkerIcon, cardedMarkers, true,key)
										} else {
											createMarkersProcessProjectTask(record.geometries, record, value.formId, taskId, blueMarkerIcon, nonCardedMarkers, false,key)
										}
									}									
							});
						});
						//add layers to map start
						$scope.goTOJobLocation();
						$scope.navigateToLocation();
						if ($rootScope.NavigatedFrom == "form") {
							_map.addLayer(cardedMarkers);
							_map.addLayer(nonCardedMarkers);
						}
					}
				});
			};
			$scope.createTaskMarkers = function () {
				var taskId = commonService.getSelectedTaksId();
				var formId = commonService.getSelectedFormId();
				var user = $localstorage.getObject("username");

				var greenMarkerIcon = L.icon({
						iconUrl: 'img/green.png',
						iconSize: [30, 30], // size of the icon
					});
				var blueMarkerIcon = L.icon({
						iconUrl: 'img/blue.png',
						iconSize: [30, 30], // size of the icon
					});

				var url = config.url + "/api/v1/formszDetails/getLatLongWIthForm/" + formId + "/" + taskId + "/" + user + "";
				mapService.getMapRecords(url, securityHeaders, function (response, status) {
					console.log(response);
					$scope.tasklist = [];
					if (response.status == 204) {
						alertService.doAlert(response.message);
					}
					if (response.status == 200) {
						if(response.data.latlngData[0].records.length > 0){
							angular.forEach(response.data.latlngData, function (value, key) {
								angular.forEach(value.records, function (record, key) {
									angular.forEach(record.geometries, function (geometer, key) {
										if(geometer.lat != undefined && geometer.lat != "" && geometer.long != undefined && geometer.long != ""){
											$scope.tasklist.push({
												lat: geometer.lat,
												long: geometer.long,
												recordId: record.recordId,
												formId: value.formId
											});
											
											if (record.status) {
												console.log(record)
												console.log("this is green marker");
												createMarkersProcess(geometer, record, value.formId, taskId, greenMarkerIcon, cardedMarkers, true)
											} else {
												console.log("this is blue markerrrrr");
												createMarkersProcess(geometer, record, value.formId, taskId, blueMarkerIcon, nonCardedMarkers, false)
											}
										}									
									});
								});
							});
							//add layers to map start
							$scope.goTOJobLocation();
							$scope.navigateToLocation();
							if ($rootScope.NavigatedFrom == "form") {
								_map.addLayer(cardedMarkers);
								_map.addLayer(nonCardedMarkers);
							}
						}else{
							alertService.showToast("Lat longs are not associated with the records");
						}
					}
				});
			};

			var activeLayersArray = [];
			/**
	         * @desc 
	            For navigating to the mumbai location 
	         * @author Santhosh Kumar Gunti
         	*/
			angular.extend($scope, {
				center : {
					lat: 19.1190,
                	lng: 72.8470,
                	zoom: 10				
                },
				legend : {
					position : 'bottomleft',
					colors : ['#167C9E', '#29C22E', '#DBD82C', '#D69318'],
					labels : []
				},
				controls : {
					scale : false
				},
				defaults : {
					maxZoom : 21,
					minZoom : 2,
					keyboard : true,
					worldCopyJump : true,
					dragging : true,
					zoomControl :false,
					scrollWheelZoom:false
				},
				layers : {
					baselayers : {
/*						osm : {
							name : 'OpenStreetMap',
							url : 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
							type : 'xyz',
							layerOptions : {
								showOnSelector : false
							}
						}
*/					}
				}

			});
			$scope.osmBaseLayer = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {});
			$scope.noneBaseLayer = L.tileLayer('', {});
			
			$scope.layerControl.addBaseLayer($scope.osmBaseLayer, "Open Street Map");
			$scope.layerControl.addBaseLayer($scope.noneBaseLayer, "None");


			leafletData.getMap().then(function (map) {
				$rootScope.map = map;
				L.control.scale({
					'position': 'bottomleft',
					'metric': true,
					'imperial': false
				}).addTo($rootScope.map);
				$scope.layerControl.addTo($rootScope.map);
				$rootScope.map.on('overlayadd', onOverlayAdd);
				$rootScope.map.on('overlayremove', overlayRemove);

				mapComponentServices.layerConfiguration($scope);
				$scope.currentZoomLevel = $rootScope.map.getZoom();

				$rootScope.map.on('zoomstart', function (e) {
					$scope.currentZoomLevel = $rootScope.map.getZoom();
				});
				$rootScope.map.on('zoomend', function (e) {
					$scope.currentZoomLevel = $rootScope.map.getZoom();
				});

				$rootScope.map.on('click', onMapClick);

			});


			/**
			 * @param {Map Event}
	         * @desc 
	            Called when adding overlay to the layer control 
	         * @author Santhosh Kumar Gunti
         	*/
			function onOverlayAdd(e) {
				angular.forEach($scope.accessibleLayers, function(value, key) {
                    if($scope.layerCodes.indexOf(value.code) == -1 && e.name == value.name){
                    	console.log(e.name);
                    	$scope.layerCodes.push(value.code);
                    }
				});
			}

			/**
			 * @param {Map Event}
	         * @desc 
	            Called when removing overlay from the layer control 
	         * @author Santhosh Kumar Gunti
         	*/
			function overlayRemove(e) {
            	angular.forEach($scope.accessibleLayers, function(value, key) {
                    if($scope.layerCodes.indexOf(value.code) > -1  && e.name == value.name){
                    	console.log(e.name);
	                    $scope.layerCodes.splice($.inArray(value.code,$scope.layerCodes), 1);
                    }
				});
			}

			$scope.getlatlngfromaddress = function (lat, lng, addressText) {

				$scope.center = {
					lat: lat,
					lng: lng,
					zoom: 15
				};
				if (addressSearchMarker) {
					_map.removeLayer(addressSearchMarker)
				}
				if(addressText)
				{
					addressSearchMarker = L.marker([lat,lng]).addTo(_map)
					.bindPopup(addressText)
					.openPopup();
				}
				else{
					addressSearchMarker = L.marker([lat,lng]).addTo(_map)
					
				}
				
				
				commonService.Loaderhide();
			};

			$scope.openMenu = function () {
$ionicSideMenuDelegate.toggleLeft();
//			    $ionicSideMenuDelegate.toggleRight();
		  	};

			$scope.gotoAddresSerchArea = function (lat, lng, addressText) {
				$scope.center = {
					lat: lat,
					lng: lng,
					zoom: 15
				};
				if (addressSearchMarker) {
					_map.removeLayer(addressSearchMarker)
				}
				addressSearchMarker = L.marker([lat, lng]).addTo(_map).bindPopup(addressText);

				commonService.Loaderhide();
			};
			/**
	         * @desc 
	            Navigating to Home View 
	         * @author Santhosh Kumar Gunti
         	*/
			$scope.gotoHomeView = function(){
				if(!checkPopupExistsOnMap())
					mapComponentServices.gotoHomeView($scope);
			}

			function checkPopupExistsOnMap(){
		   		var isExist = false;
		   		if ($scope.modalFeatureSelection != undefined && $scope.modalFeatureSelection._isShown) {
					mapComponentServices.closePopup($scope);	
					isExist = true;
				}
		   		else if($scope.modalCloseAddBookmark != undefined && $scope.modalCloseAddBookmark._isShown) {
					mapComponentServices.closeAddBookmark($scope);	
					isExist = true;
		   		}
		   		else if($scope.modalCloseEditBookmark != undefined && $scope.modalCloseEditBookmark._isShown){
					mapComponentServices.closeEditBookmark($scope);	
					isExist = true;
		   		}
		   		else if($scope.modalCloseShowBookmark != undefined && $scope.modalCloseShowBookmark._isShown){
					mapComponentServices.closeShowBookmark($scope);	
					isExist = true;
		   		}
		   		else if($scope.modalRouteBetween2Points != undefined && $scope.modalRouteBetween2Points._isShown){
					mapComponentServices.closeRouteBetweenModal($scope);
					mapComponentServices.routeSearchDone($scope);
					isExist = true;
		   		}
		   		else if($scope.modalCloseBufferSelection != undefined && $scope.modalCloseBufferSelection._isShown){
					mapComponentServices.closeBufferSearchLengthModal($scope);
					isExist = true;
		   		}
				return isExist;
			}

			$scope.showBookmark = function(){
				mapComponentServices.showBookmark($scope);
			}

			$scope.pointGeometry = function(){
				mapComponentServices.pointGeometry($scope);
			}

			$scope.lineGeometry = function(){
				mapComponentServices.lineGeometry($scope);
			}

			$scope.areaGeometry = function(){
				mapComponentServices.areaGeometry($scope);
			}

			$scope.annotationGeometry = function(){
				mapComponentServices.annotationGeometry($scope);
			}

			$scope.undoGeometry = function(){
				mapComponentServices.undoGeometry($scope);
			}

			$scope.closeModalForSaveSketching = function(){
				mapComponentServices.closeModalForSaveSketching($scope);
			}

			$scope.closeModalForAnnotationSketching = function(){
				mapComponentServices.closeModalForAnnotationSketching($scope);
			}

			$scope.setAnnotation = function (annotationName) {
				mapComponentServices.setAnnotation($scope,annotationName);
			};

			$scope.popoverForSaveGeometry = function(){
				mapComponentServices.popoverForSaveGeometry($scope);
			}

			$scope.saveGeometry = function(sketchingName){
				mapComponentServices.saveGeometry($scope,sketchingName);
			}

			$scope.clearMap = function(){
				mapComponentServices.clearMap($scope);
			}
			$scope.zoomToBookmark = function(bookmarkName){
				mapComponentServices.zoomToBookmark($scope,bookmarkName);
			}

			$scope.deleteBookmark = function(bookmarkName){
				mapComponentServices.deleteBookmark($scope,bookmarkName);
			}

			$scope.measureTool = function(){
				if(!checkPopupExistsOnMap())
					mapComponentServices.measureTool($scope);
            }

			$scope.showRoute = function(source,destination){
				mapComponentServices.showRoute($scope,source,destination);
            }

            $scope.routeBetween2Points = function(){
				if(!checkPopupExistsOnMap())
					mapComponentServices.routeBetween2PointsTool($scope);
            }

			$scope.editBookmark = function(oldBookmarkName){
				mapComponentServices.editBookmark($scope,oldBookmarkName);
			}
			$scope.updateBookmark = function(newBookmarkName){
				mapComponentServices.updateBookmark($scope,newBookmarkName);
			}
			$scope.createBookmark = function(bookmarkName){
				mapComponentServices.createBookmark($scope,bookmarkName);
			}
  	        $scope.expandAcordian = function(acordianCheck){
    	    	if(!acordianCheck.value){
        	    	acordianCheck.value = false; 
          		}
          		else{
          		}
          		acordianCheck.value = !acordianCheck.value;
        	};

  	        $scope.toggleBUfferSearch = function(bufferSearchCheck){
				if(!checkPopupExistsOnMap())
	  	        	mapComponentServices.toggleBUfferSearch($scope);
        	};

  	        $scope.togglePointGeometryCheck = function(bufferSearchCheck){
  	        	mapComponentServices.togglePointGeometryCheck($scope);
        	};

  	        $scope.toggleLineGeometryCheck = function(bufferSearchCheck){
  	        	mapComponentServices.toggleLineGeometryCheck($scope);
        	};

  	        $scope.toggleAreaGeometryCheck = function(bufferSearchCheck){
  	        	mapComponentServices.toggleAreaGeometryCheck($scope);
        	};

		    $scope.showBookmarks = function(){
				if(!checkPopupExistsOnMap())
			    	mapComponentServices.showBookmarks($scope);
		    }

			$scope.bufferSearch = function(lat,lng,bufferSearchDistance){
				mapComponentServices.bufferSearch($scope,lat,lng,bufferSearchDistance);
			}
			$scope.goTOCurrentLocationONMAp = function () {
				console.log("goTOCurrentLocation")
//				commonService.LoaderShow();

				commonService.getLatLong(function (geoLocation) {

					if (geoLocation.netstatus == "success") {
						$scope.lat = geoLocation.latlong[0];
						$scope.long = geoLocation.latlong[1];
						$scope.currentLocationMarkerCreation($scope.lat, $scope.long)

					} else if (geoLocation.netstatus == "error") {
						console.log("error");
						commonService.Loaderhide();
						alertService.showToast(geoLocation.message);
					}
				});

			};
			$scope.currentLocationMarkerCreation = function (lat, lng) {
				$scope.center = {
					lat: lat,
					lng: lng,
					zoom: 15
				};
				if (marker) {
					console.log("map iffffffffffff")
					_map.removeLayer(marker)
				}

				marker = L.marker([lat, lng]).addTo(_map)
					.bindPopup($scope.addressText)

					commonService.Loaderhide();

				$scope.addressText = "no data";

				//geocoder

				var latlng = {
					lat: parseFloat($scope.lat),
					lng: parseFloat($scope.long)
				};

				var option = {
					serviceUrl: "http://nominatim.openstreetmap.org/",
					geocodingQueryParams: {
						lat: 17.34567,
						long: 78.345678,
						Zoom: 12
					},
					zoom: 15
				}
				var bb = new L.Control.Geocoder.Nominatim(option);
				bb.reverse(latlng, 13, function (data) {
					console.log(data[0].name)
					$scope.addressText = data[0].name;
					marker._popup.setContent($scope.addressText)
					marker.openPopup();

					//$scope.getlatlngfromaddress($scope.lat, $scope.long,data[0].name);
				}, function (err) {
					console.log("geocoder failsssssssssss");
				})

			}

			$scope.goTOJobLocation = function () {
//				commonService.LoaderShow();
				leafletData.getMap().then(function (map) {
					_map = map;
					var group = new L.featureGroup($scope.arr);
					if($scope.arr.length == 0){
						alertService.showToast("Lat longs are not associated with the records");
					}else{
						//	_map.setView(cardedMarkers.getBounds().getCenter());
						_map.fitBounds(group.getBounds(), 16);
					}
				});
				commonService.Loaderhide();
			};

			//back porting form UE by venki end

			/*$http.get("http://183.82.100.86:4002/gss/gssrest/rest?service=ejb/MarblesLocal&method=getLayerInfo&json=true", {
				headers : {
					'Content-Type' : "application/json"
				}
			})
			.success(function (res) {
				angular.forEach(res.layers, function (value, key) {
					var tilelayer = new L.TileLayer.WMTS("http://183.82.100.86:4002/maps", {
							layer : value.name,
							style : "",
							tilematrixSet : value.tileset,
							format : "image/png",
							maxZoom : 25
						});
					layerControl.addOverlay(tilelayer, value.name);
				});
				L.control.scale({
					'position' : 'bottomleft',
					'metric' : true,
					'imperial' : false
				}).addTo(_map);
				layerControl.addTo(_map);

			});*/
			/*$scope.getlatlngfromaddress = function (lat, lng) {
				$scope.center = {
					lat : lat,
					lng : lng,
					zoom : 12
				};
				leafletData.getMap().then(function (map) {
					_map = map;
					cordova.plugins.Keyboard.close();
				});
			};*/
			$scope.showFilterBar = function () {
				$rootScope.searchIcon = false;
				$rootScope.autocomplete = true;
				$rootScope.clearIcon = true;
				$scope.shouldBeOpen = true;
				cordova.plugins.Keyboard.show();
			};
			$scope.hideSearch = function () {
				$rootScope.clearIcon = false;
				$rootScope.autocomplete = false;
				$rootScope.searchIcon = true;
				$scope.shouldBeOpen = false;
				cordova.plugins.Keyboard.close();
			};
			$scope.disableTap = function () {
				var container = document.getElementsByClassName('pac-container');
				angular.element(container).attr('data-tap-disabled', 'true');
				var backdrop = document.getElementsByClassName('backdrop');
				angular.element(backdrop).attr('data-tap-disabled', 'true');
				angular.element(container).on("click", function () {
					document.getElementById('autocomplete').blur();
				});
			};
			/*
			This function is used to remove an overlay from the layers object
			1. Hide the overlay
			2. delete the object from the overlays object
			 */
			$scope.removeOverlay = function (layerName) {

				$scope.layers.overlays[layerName].visible = false;
				delete $scope.layers.overlays[layerName];
			};

			/*
			This function is used to add an overlay to the layers object
			1. prepare the options for the overlay
			2. add the object to the overlays object
			 */
			$scope.addOverlay = function (layerName, options) {

				options.name = layerName;
				options.visible = true;
				$scope.layers.overlays[layerName] = options;
			};

			$scope.$on('leafletDirectiveMarker.click', function (e, args) {
				//$scope.maprecordId='581b2ac06ccc5f7c0f2695c7';
				$scope.maprecordId = args.model.recid;
				//alert(args.model.recid+"  : "+args.model.formid);
			});

			$scope.$on('enableSketchingForAdd', function () {
				$scope.typeOfSketching = "add";
				$scope.isSketchingEnabled = true;
				$scope.enablePointGeometryCheck = true;
				$scope.enableLineGeometryCheck = true;
				$scope.enableAreaGeometryCheck = true;
				$scope.enableUndoGeometryCheck = true;
			});

			$scope.$on('enableSketchingForEdit', function () {
				$scope.typeOfSketching = "edit";
				$scope.isSketchingEnabled = true;
				$scope.enablePointGeometryCheck = false;
				$scope.enableLineGeometryCheck = false;
				$scope.enableAreaGeometryCheck = false;
				$scope.enableUndoGeometryCheck = false;
			});

			$scope.$on('disableSketching', function () {
				$scope.isSketchingEnabled = false;
	
				if($scope.interactionHandler != undefined)
					$scope.interactionHandler.disable();

		    	$scope.lineGeometryCheck.value = false; 
		    	$scope.areaGeometryCheck.value = false; 
		    	$scope.pointGeometryCheck.value = false;
			});

			$scope.$on('showPrePopDataForTasks', function () {
				$scope.createTaskMarkers();
			});

			$scope.$on('showPrePopDataForProjectTasks', function () {
				$scope.createProjectTaskMarkers();
			});

			$scope.$on('hidePrePopData', function () {
				if(cardedMarkers != undefined){
			        $rootScope.map.removeLayer(cardedMarkers);
			        cardedMarkers.clearLayers();
		        }
				if(nonCardedMarkers != undefined){
			        $rootScope.map.removeLayer(nonCardedMarkers);
			        nonCardedMarkers.clearLayers();
		        }
			});

			$scope.$on('hideRoutingOnMap', function () {
				if ($scope.control != undefined) {
					_map.removeControl($scope.control);
					$scope.control = undefined;
				}
			});

			$scope.removeMarkers = function () {
				$scope.markers = {};
			};

			$scope.goBack = function(){
				$scope.featuresCount = $scope.mapSelectionData.length;
				$scope.itemsList = $scope.mapSelectionData;
			};

			$scope.routeSearchDone = function(){
				mapComponentServices.closeRouteBetweenModal($scope);
				mapComponentServices.routeSearchDone($scope);
			};
			$scope.copySelectedField = function(){
				mapComponentServices.copySelectedField($scope);	
			};

			$scope.$on('closePopoversInMapOnOffline', function () {
		   		if ($scope.modalFeatureSelection != undefined && $scope.modalFeatureSelection._isShown) {
					mapComponentServices.closePopup($scope);	
		   		}
		   		if($scope.modalCloseAddBookmark != undefined && $scope.modalCloseAddBookmark._isShown) {
					mapComponentServices.closeAddBookmark($scope);	
		   		}
		   		if($scope.modalCloseEditBookmark != undefined && $scope.modalCloseEditBookmark._isShown){
					mapComponentServices.closeEditBookmark($scope);	
		   		}
		   		if($scope.modalCloseShowBookmark != undefined && $scope.modalCloseShowBookmark._isShown){
					mapComponentServices.closeShowBookmark($scope);	
		   		}
		   		if($scope.modalRouteBetween2Points != undefined && $scope.modalRouteBetween2Points._isShown){
					mapComponentServices.closeRouteBetweenModal($scope);
					mapComponentServices.routeSearchDone($scope);
		   		}
		   		if($scope.modalCloseBufferSelection != undefined && $scope.modalCloseBufferSelection._isShown){
					mapComponentServices.closeBufferSearchLengthModal($scope);
		   		}
		   		
		  	});

			$scope.$on('closePopoversInMap', function () {
		   		if ($scope.modalFeatureSelection != undefined && $scope.modalFeatureSelection._isShown) {
					mapComponentServices.closePopup($scope);	
		   		}
		   		else if($scope.modalCloseAddBookmark != undefined && $scope.modalCloseAddBookmark._isShown) {
					mapComponentServices.closeAddBookmark($scope);	
		   		}
		   		else if($scope.modalCloseEditBookmark != undefined && $scope.modalCloseEditBookmark._isShown){
					mapComponentServices.closeEditBookmark($scope);	
		   		}
		   		else if($scope.modalCloseShowBookmark != undefined && $scope.modalCloseShowBookmark._isShown){
					mapComponentServices.closeShowBookmark($scope);	
		   		}
		   		else if($scope.modalRouteBetween2Points != undefined && $scope.modalRouteBetween2Points._isShown){
					mapComponentServices.closeRouteBetweenModal($scope);
					mapComponentServices.routeSearchDone($scope);
		   		}
		   		else{		
					$scope.openMenu();
				}
		  	});

			$scope.done = function(){
				mapComponentServices.closePopup($scope);	
			};

			$scope.closeShowBookmark = function(){
				mapComponentServices.closeShowBookmark($scope);	
			};

			$scope.closeAddBookmark = function(){
				mapComponentServices.closeAddBookmark($scope);	
			};

			$scope.closeEditBookmark = function(){
				mapComponentServices.closeEditBookmark($scope);	
			};

			$scope.okBufferLength = function(distance){
				mapComponentServices.okBufferLength($scope,distance,$scope.bufferSearchCenterLat, $scope.bufferSearchCenterLng);	
			};

			$scope.cancelBufferLength = function(){
				mapComponentServices.closeBufferSearchLengthModal($scope);	
			};

/*			$scope.backTorecords = function () {
		   		if ($scope.modalFeatureSelection != undefined && $scope.modalFeatureSelection._isShown) {
					mapComponentServices.closePopup($scope);	
		   		}
		   		else if($scope.modalCloseAddBookmark != undefined && $scope.modalCloseAddBookmark._isShown) {
					mapComponentServices.closeAddBookmark($scope);	
		   		}
		   		else if($scope.modalCloseEditBookmark != undefined && $scope.modalCloseEditBookmark._isShown){
					mapComponentServices.closeEditBookmark($scope);	
		   		}
		   		else if($scope.modalCloseShowBookmark != undefined && $scope.modalCloseShowBookmark._isShown){
					mapComponentServices.closeShowBookmark($scope);	
		   		}
		   		else if($scope.modalRouteBetween2Points != undefined && $scope.modalRouteBetween2Points._isShown){
					mapComponentServices.closeRouteBetweenModal($scope);
					mapComponentServices.routeSearchDone($scope);
		   		}
		   		else{		
					commonService.setSketchingStatus(false);
					$rootScope.frommap = true;
					$ionicHistory.goBack();
				}
			};
*/			$scope.showFeaturedetails = function(id,object_type,showBackButton){
				mapComponentServices.showFeaturedetails(id,object_type,showBackButton,$scope);
			}
			/**
	         * @desc 
	            For showing info window on click of current location marker  
	         * @modified by Santhosh Kumar Gunti
	         * type : modify
         	*/

			$scope.goTOCurrentLocation = function () {
				commonService.getLatLong(function (geoLocation) {
					if (geoLocation.netstatus == "success") {
						$scope.lat = geoLocation.latlong[0];
						$scope.long = geoLocation.latlong[1];
//						$scope.getlatlngfromaddress($scope.lat, $scope.long);
						$scope.currentLocationMarkerCreation($scope.lat, $scope.long)
					}
					if (geoLocation.netstatus == "error") {
						commonService.Loaderhide();
						alertService.showToast(geoLocation.message);
					}
				});

			};
			$scope.init();

		}
	]);
