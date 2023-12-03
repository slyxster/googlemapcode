var appMarkers = [];
var covidMarkers = [];
var prev_infowindow;
var prev_id = -1;
var clinicmap;
var markers;
var markercluster;
var clinicmarkers = [];

 function codeAddress( map, fulladdress, icon, desc ) {
  	var geocoder = new google.maps.Geocoder();
	var coord;
	 
    geocoder.geocode( { 'address': fulladdress}, function(results, status) {
      if (status == 'OK') {
        	var lat = results[0].geometry.location.lat();
			var long = results[0].geometry.location.lng();
		   	coord = new google.maps.LatLng( lat, long);
              var marker = new google.maps.Marker({
				  position: coord,
				  icon: icon,
				  id: "mk_mobile",
				});
		  
				  var infowindow = new google.maps.InfoWindow({
						content		: desc
					});

				// show info window when marker is clicked
				google.maps.event.addListener(marker, 'click', function() {
				  if( prev_infowindow ) {
				   	prev_infowindow.close();
				  }
				  prev_infowindow = infowindow;
				  infowindow.open( map, marker );
				});
		  
        		marker.setMap(map);	  
        //alert('Geocode was not successful for the following reason: ' + status);
      }
    });
  }

function haversine_distance(mk1, mk2) {
	var R = 3958.8; // Radius of the Earth in miles
	var rlat1 = mk1.position.lat() * (Math.PI/180); // Convert degrees to radians
	var rlat2 = mk2.position.lat() * (Math.PI/180); // Convert degrees to radians
	var difflat = rlat2-rlat1; // Radian difference (latitudes)
	var difflon = (mk2.position.lng()-mk1.position.lng()) * (Math.PI/180); // Radian difference (longitudes)

	var d = 2 * R * Math.asin(Math.sqrt(Math.sin(difflat/2)*Math.sin(difflat/2)+Math.cos(rlat1)*Math.cos(rlat2)*Math.sin(difflon/2)*Math.sin(difflon/2)));
	return d;
}

function new_map( $el, $zoom, $type ) {
	
	  var args;
	  var automarkers = $el.find('.marker');
	
	  var mapOptions = {
		  panControl: true,
		  zoomControl: true,
		  mapTypeControl: true,
		  scaleControl: true,
		  streetViewControl: true,
		  overviewMapControl: true,
		  rotateControl: true,
		  fullScreenControl: false,
		  mapTypeIds: []
		}
	  
	if ($type == "alumni") {
		// vars
		 args = {
			zoom		: $zoom,
			center		: { lat: 39.8097343, lng: -98.5556199  },
			mapTypeControlOptions: mapOptions
		};
	} else {
		// vars
		 args = {
			zoom		: $zoom,
			center		: { lat: 25.91, lng: -80.89  },
			mapTypeControlOptions: mapOptions
		};
	}
		
	// create map	        	
	var map = new google.maps.Map( $el[0], args);
  
   //Associate the styled map with the MapTypeId and set it to display.
        //map.mapTypes.set('styled_map', styledMapType);
        //map.setMapTypeId('styled_map');
	
	// add a markers reference
	map.markers = [];
	  
	// add markers
	automarkers.each(function(){ 
      	var details = jQuery(this).html();
		var markerid = 1;
		var markertype = jQuery(this).data('markertype');
		var icon;
		
		if (markertype == "clinic") {
			 icon = {
				url: "/wp-content/uploads/2023/01/CHI-ICONS_MapPin_HealthCenter@2x.png", // url
				scaledSize: new google.maps.Size(30, 30), // scaled size
				origin: new google.maps.Point(0,0), // origin
				anchor: new google.maps.Point(15,32) // anchor
			};
		} else if (markertype == "alumni" || markertype == "resident") {
			icon = {
				url: "/wp-content/uploads/2023/08/MapPin_62x90.png", // url
				scaledSize: new google.maps.Size(31,45), // scaled size
				origin: new google.maps.Point(0,0), // origin
				anchor: new google.maps.Point(15,32) // anchor
			};
		} else {
			 icon = {
				url: "/wp-content/uploads/2023/01/CHI-ICONS_MapPin_MobileUnit@2x.png", // url
				scaledSize: new google.maps.Size(35, 35), // scaled size
				origin: new google.maps.Point(0,0), // origin
				anchor: new google.maps.Point(15,32) // anchor
			};
		}
		
		var coord = new google.maps.LatLng( jQuery(this).data('lat'), jQuery(this).data('long') );
		var hasUrgent = jQuery(this).data('urgent');   
		var hasCovid = jQuery(this).data('covid');
		markerid = jQuery(this).data('markerid');
				
		var marker = new google.maps.Marker({
              position: coord,
              icon: icon,
			  id: "mk_" + markerid,
            });
				
      		map.markers.push(marker);
		
			clinicmarkers.push(marker);
		
			if (hasUrgent == 0) {
				appMarkers.push(marker);
			}
			if (hasCovid == 0) {
				covidMarkers.push(marker);
			}
		var infowindow = new google.maps.InfoWindow({
			content		: details
		});
		
        // show info window when marker is clicked
        google.maps.event.addListener(marker, 'click', function() {
						
          if( prev_infowindow ) {
			   prev_infowindow.close();
		  }
          prev_infowindow = infowindow;
			
		  if (prev_id != marker.id) {
          	infowindow.open( map, marker );
					  prev_id = marker.id;
		  }

        });
           
      	marker.setMap(map);
    });
	
		if ($type == "alumni") {
			var markers = map.markers;
			markercluster = new MarkerClusterer(map,markers);
		}

	// return
	return map;
}

/*
*  add_marker
*
*  This function will add a marker to the selected Google Map
*
*  @type	function
*  @date	8/11/2013
*  @since	4.3.0
*
*  @param	$marker (jQuery element)
*  @param	map (Google Map object)
*  @return	n/a
*/

function add_marker( mapmarker, map ) {
  
  	//var mapmarker;
 
  	//loc = $marker.data('location');
  
  	//if ( locations[loc] ) {
      //	mapmarker = locations[loc];
    //} else {
      //  locations[$marker.data('location')] = mapmarker;
    //}
  
	// add to array
	map.markers.push( mapmarker );
  
		// create info window
		var infowindow = new google.maps.InfoWindow({
			content		: "Mobile Location"
		});
  
		// show info window when marker is clicked
		google.maps.event.addListener(mapmarker, 'click', function() {
			infowindow.open( map, mapmarker );
		});

}

/*
*  center_map
*
*  This function will center the map, showing all markers attached to this map
*
*  @type	function
*  @date	8/11/2013
*  @since	4.3.0
*
*  @param	map (Google Map object)
*  @return	n/a
*/

function center_map( map ) {

	// vars
	var bounds = new google.maps.LatLngBounds();

	// loop through all markers and create bounds
	$.each( map.markers, function( i, marker ){
		var latlng = new google.maps.LatLng( marker.position.lat(), marker.position.lng() );
		bounds.extend( latlng );
	});

	// only 1 marker?
	if( map.markers.length == 1 )
	{
		// set center of map
	    map.setCenter( bounds.getCenter() );
	    map.setZoom( 16 );
	}
	else
	{
		// fit to bounds
		map.fitBounds( bounds );
	}

}
	
var map = null;
var locations = [];
var prev_infowindow = false; 
var clinicmap = null;
var alumnimap = null;

function initAlumniMap() {
	jQuery('#gradmap').each(function(){
		// create map
		alumnimap = new_map( jQuery(this), 4, 'alumni' );
		markers = alumnimap.markers;
		
	});
	
	console.log("Alumni Map Loaded");
	//return map;
}

function initMap() {
	jQuery('#clinicmap').each(function(){
		// create map
		clinicmap = new_map( jQuery(this), 7 , 'clinic' );
		markers = clinicmap.markers;
	});
	
	console.log("Map Loaded");
	//return map;
}
function initMapMobile() {
	jQuery('#clinicmapmobile').each(function(){
		// create map
		clinicmap = new_map( jQuery(this), 7, 'mobile');
		markers = clinicmap.markers;
	});
		//return map;
}

//google.maps.event.addDomListener(window, 'load', initMap);

jQuery(document).ready(function( $ ) {
	
	 $('body').on('click', 'span.close', function() {
			prev_infowindow.close();
        });
	
	//window.addEventListener("load", initMap);
	window.addEventListener("load", initMapMobile);

	var clinicmap = initMap();
	var gradmap = initAlumniMap();

	$('.showonmap').on('click', function() {
		var clickedmarker = $(this).parent().parent().data('mapid');
			clickedmarker = clickedmarker - 1;
		
		for (var i = 0; i < clinicmarkers.length; i++) {
			var marker = clinicmarkers[i];
			if ( i == clickedmarker ) {
				marker.setVisible(true);
			} else {
				marker.setVisible(false);
			}
		}   
			
	});
	
	$('#selectclinicservice').on('click',function() {
			var selection = $(this).val();
			var mapmarkers = markers;

			if (selection != 0) {
				
				for (x=0; x < mapmarkers.length; x++) {
					mapmarkers[x].setVisible(false);
				}

				$('.clinic_list .clinic').each(function(n) {
					var services = $(this).data('services');
					var mapid = $(this).data('mapid');
					
					if ( services && services.includes(selection)) {
						$(this).removeClass('ishidden');
						mapmarkers[mapid].setVisible(true);
					} else {
						$(this).addClass('ishidden');
					}
					
				});
			} else {
				$('.clinic_list .clinic').removeClass('ishidden');
				for (x=0; x<mapmarkers.length; x++) {
					mapmarkers[x].setVisible(true);
				}
			}
		
	});
	
	$('#urgentcare').on('click', function() {
		
		// Make sure markers are visible
		for (var i = 0; i < appMarkers.length; i++) {
			var marker = appMarkers[i];
			marker.setVisible(true);
		}   
		
		if ( $('#urgentcare').is(':checked')) {
			$('.clinic_list .clinic').each(function() {
				if ($(this).data('urgent') == "0") {
					$(this).hide();
					for (var i = 0; i < appMarkers.length; i++) {
						var marker = appMarkers[i];
							marker.setVisible(false);
					}   
				}
			});
		} else {
			$('.clinic_list .clinic').show();
			for (var i = 0; i < appMarkers.length; i++) {
						var marker = appMarkers[i];
							marker.setVisible(true);
					}   
		}
		
	});
	
	$('#covidservices').on('click', function() {
		
		// Make sure markers are visible
		for (var i = 0; i < covidMarkers.length; i++) {
			var marker = covidMarkers[i];
			marker.setVisible(true);
		}   
		
		if ( $('#covidservices').is(':checked')) {
			$('.clinic_list .clinic').each(function() {
				if ($(this).data('covid') == "0") {
					$(this).hide();
					for (var i = 0; i < covidMarkers.length; i++) {
						var marker = covidMarkers[i];
							marker.setVisible(false);
					}   
				}
			});
		} else {
			$('.clinic_list .clinic').show();
			for (var i = 0; i < covidMarkers.length; i++) {
						var marker = covidMarkers[i];
							marker.setVisible(true);
					}   
		}
		
	});
	
	$('.wpslsubmit').on('click', function() {
		
		var mapmarkers = markers;
		var lat;
		var lng;
		
		setTimeout(function(){
			
			$('.clinic_list .clinic').each(function() {
				var clinicid = $(this).data('mapid');	
				clinicid = clinicid - 1;
				mapmarkers[clinicid].setVisible(false);
			});
			
        	// doing async stuff
        	$('.wpsl-results p').each(function() {
				var foundlocation = $('strong > a', this).text();
				
				$('.clinic_list .clinic').each(function() {
					var clinicid = $(this).data('mapid');
						clinicid = clinicid - 1;

					var clinicname = $(this).data('name');
					
					console.log(clinicname + " " + foundlocation);
									
					if (clinicname == foundlocation) {
						mapmarkers[clinicid].setVisible(true);
						lat = $(this).data('lat');
						lng = $(this).data('long');
						
						console.log(lat + " " + lng);
					}
				});
			});
			
			
			var pt = new google.maps.LatLng(lat, lng);
  			clinicmap.setCenter(pt);
			clinicmap.setZoom(10);
    	}, 12000);
		
	});
	
	
});
