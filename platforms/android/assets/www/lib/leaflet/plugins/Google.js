/*
 * Google layer using Google Maps API
 */
/*jshint smarttabs:true, strict:false*/
//(function (google, L) {

L.Google = L.Class.extend({
	includes: L.Mixin.Events,

	options: {
		minZoom: 0,
		maxZoom: 18,
		tileSize: 256,
		subdomains: 'abc',
		errorTileUrl: '',
		attribution: '',
		opacity: 1,
		continuousWorld: false,
		noWrap: false,
		mapOptions: {
			backgroundColor: '#dddddd'
		}
	},

	// Possible types: SATELLITE, ROADMAP, HYBRID, TERRAIN
	initialize: function(type, options) {
		L.Util.setOptions(this, options);

		this._ready = google.maps.Map != undefined;
		if (!this._ready) L.Google.asyncWait.push(this);

		this._type = type || 'SATELLITE';
	},

	onAdd: function(map, insertAtTheBottom) {
		this._map = map;
		this._insertAtTheBottom = insertAtTheBottom;

		// create a container div for tiles
		this._initContainer();
		this._initMapObject();

		this._addInvisibleMarker(map);

		// set up events
		map.on('viewreset', this._resetCallback, this);

		this._limitedUpdate = L.Util.limitExecByInterval(this._update, 150, this);
		map.on('move', this._update, this);

		if (map._zoomAnimated) {
			map.on({
				'zoomanim': this._animateZoom,
				'zoomend': this._endZoomAnimation
			}, this);
		}


		//20px instead of 1em to avoid a slight overlap with google's attribution
		map._controlCorners['bottomright'].style.marginBottom = "20px";
		map._controlCorners['bottomleft'].style.marginBottom = "20px";

		this._reset();
		this._update();
	},

	onRemove: function(map) {
		this._map._container.removeChild(this._container);
		//this._container = null;
		this._map.removeLayer(this._invisibleMarker);

		this._map.off('viewreset', this._resetCallback, this);

		this._map.off('move', this._update, this);

		if (map._zoomAnimated) {
			map.off({
				'zoomanim': this._animateZoom,
				'zoomend': this._endZoomAnimation
			}, this);
		}


		map._controlCorners['bottomright'].style.marginBottom = "0em";
		map._controlCorners['bottomleft'].style.marginBottom = "0px";
		//this._map.off('moveend', this._update, this);
		
		google.maps.event.clearInstanceListeners(this._google);
	},

	getAttribution: function() {
		return this.options.attribution;
	},

	setOpacity: function(opacity) {
		this.options.opacity = opacity;
		if (opacity < 1) {
			L.DomUtil.setOpacity(this._container, opacity);
		}
	},

	setElementSize: function(e, size) {
		e.style.width = size.x + "px";
		e.style.height = size.y + "px";
	},

	_initContainer: function() {
		var tilePane = this._map._container,
			first = tilePane.firstChild;

		if (!this._container) {
			this._container = L.DomUtil.create('div', 'leaflet-google-layer leaflet-top leaflet-left');
			this._container.id = "_GMapContainer_" + L.Util.stamp(this);
			this._container.style.zIndex = "auto";
		}

		if (true) {
			tilePane.insertBefore(this._container, first);

			this.setOpacity(this.options.opacity);
			this.setElementSize(this._container, this._map.getSize());
		}
	},

	_initMapObject: function() {
		if (!this._ready) return;
		this._google_center = new google.maps.LatLng(0, 0);
		var map = new google.maps.Map(this._container, {
		    center: this._google_center,
		    zoom: 0,
		    tilt: 0,
		    mapTypeId: google.maps.MapTypeId[this._type],
		    disableDefaultUI: true,
		    keyboardShortcuts: false,
		    draggable: false,
		    disableDoubleClickZoom: true,
		    scrollwheel: false,
		    streetViewControl: false,
		    styles: this.options.mapOptions.styles,
		    backgroundColor: this.options.mapOptions.backgroundColor
		});

		var _this = this;
		this._reposition = google.maps.event.addListenerOnce(map, "center_changed",
			function() { _this.onReposition(); });
		this._google = map;

		google.maps.event.addListenerOnce(map, "idle",
			function() { _this._checkZoomLevels(); });
	},


	_addInvisibleMarker: function (map) {
		//add an invisible marker to the map to ensure that 'zoomend' is fired
		//(if google is the only layer visible on the map, then there won't be any css transitions and 'zoomend' won't be fired)
		var position = this._map.getBounds().getNorthWest(); //can't use center because it may not cause a css transition on a zoomin
		this._invisibleMarker = L.marker(position, {
			icon: L.divIcon({
				className: 'leaflet-mouse-marker',
				iconAnchor: [0, 0],
				iconSize: [10, 10]
			}),
			opacity: 0
		});

		this._invisibleMarker.addTo(map);
	},

	_checkZoomLevels: function() {
		//setting the zoom level on the Google map may result in a different zoom level than the one requested
		//(it won't go beyond the level for which they have data).
		// verify and make sure the zoom levels on both Leaflet and Google maps are consistent
		if (this._google.getZoom() !== this._map.getZoom()) {
			//zoom levels are out of sync. Set the leaflet zoom level to match the google one
			this._map.setZoom( this._google.getZoom() );
		}
	},

	_resetCallback: function(e) {
		this._reset(e.hard);
	},

	_reset: function(clearOldContainer) {
		this._initContainer();
	},

	_update: function(e) {
		if (!this._google) return;
		this._resize();

		var center = e && e.latlng ? e.latlng : this._map.getCenter();
		var _center = new google.maps.LatLng(center.lat, center.lng);

		this._google.setCenter(_center);
		this._google.setZoom(this._map.getZoom());

		this._invisibleMarker.setLatLng(this._map.getBounds().getNorthWest())

		this._checkZoomLevels();
		//this._google.fitBounds(google_bounds);
	},

	_resize: function() {
		var size = this._map.getSize();
		if (this._container.style.width == size.x &&
		    this._container.style.height == size.y)
			return;
		this.setElementSize(this._container, size);
		this.onReposition();
	},


	_animateZoom: function (e) {
		//based on ImageOverlay._animateZoom
		var map = this._map,
		    nw = map.getBounds().getNorthWest(),
		    se = map.getBounds().getSouthEast(),
		    scale = map.getZoomScale(e.zoom), // same as e.scale (?)

		    topLeft = map._latLngToNewLayerPoint(nw, e.zoom, e.center),  //new top left in pixels (including map pane position)
		    size = map._latLngToNewLayerPoint(se, e.zoom, e.center)._subtract(topLeft), // size difference in pixels
		    //topLeft includes a map pane position which the google map won't have, so we need to reverse that
		    origin = topLeft._add(map._getMapPanePos())._add(size._multiplyBy((1 / 2) * (1 - 1 / scale)));
		
		this._container.style[L.DomUtil.TRANSFORM] =
		        L.DomUtil.getTranslateString(origin) + ' scale(' + scale + ') ';
	},

	_endZoomAnimation: function () {
		this._update();
		this._container.style[L.DomUtil.TRANSFORM] = '';
	},


	onReposition: function() {
		if (!this._google) return;
		google.maps.event.trigger(this._google, "resize");
	},

	redraw: function () {
		this._update();
	}
});

L.Google.asyncWait = [];
L.Google.asyncInitialize = function() {
	var i;
	for (i = 0; i < L.Google.asyncWait.length; i++) {
		var o = L.Google.asyncWait[i];
		o._ready = true;
		if (o._container) {
			o._initMapObject();
			o._update();
		}
	}
	L.Google.asyncWait = [];
};
//})(window.google, L)
