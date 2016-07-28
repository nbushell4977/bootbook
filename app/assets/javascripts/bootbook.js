$(document).ready(function() {
  toggleView();
  initMap();
  usersIndex();
})

function usersIndex() {
  $(".navbar-brand").on("click", function(event) {
    event.preventDefault();
    $.ajax({
      url: '/users',
      method: 'GET',
      dataType: 'json'
    }).done(function(response){
      initMap();   // maybe don't need this here again...
      formatDataAndPlaceMarker(response.filecontent);
    }).fail(function(response){
      console.log("shit");
    });
  });
}

function formatDataAndPlaceMarker(users) {
  users.forEach(function(user){
    var name = user.name;
    var id = user.id;
    var userPageLink = '/users/' + id;
    var profile_image = user.profile_image;
    var city = user.city;
    var state = user.state;
    var postal_code = user.postal_code;
    var country = user.country;
    var locationString = "";
    if (city != null) { locationString += city; };
    if (state != null) {
      if (city != null) {
        locationString += (', ' + state);
      } else {
        locationString += (state);
      };
    };
    if (postal_code != null) {
      if (locationString != "") {
        locationString += (' ' + postal_code);
      } else {
        locationString += postal_code;
      }
    };
    if (country != null) {
      if (country != "US") {
        if (locationString != "") {
          locationString += (' ' + country);
        } else {
          locationString += country;
        }
      }
    };

    var infoWindowContent = constructInfoWindowContent(profile_image, name, userPageLink, locationString);

    var queryString = {locationString: locationString}
    $.ajax({
      url: '/geocode',
      method: 'GET',
      data: queryString,
      dataType: 'json'
    }).done(function(response){
      var actualResponse = response.response.results[0];
      var latLng = actualResponse.geometry.location;
      setMarker(latLng, infoWindowContent);
    }).fail(function(response){
      console.log("fail");
    });
  });
}


function setMarker(latLng, infoWindowContent) {
  var infowindow = new google.maps.InfoWindow;
  var marker = new google.maps.Marker({
    map: map,
    position: latLng,
  });
  infowindow.setContent(infoWindowContent);
  // infowindow.open(map, marker);
  marker.addListener('click', function() {
    infowindow.open(map, marker)
  })
}


function constructInfoWindowContent(profile_image, name, userPageLink, locationString) {
  contentString =
    '<div id="content">' +
      '<a href="' + userPageLink + '"><span><img src="' + profile_image + '" width="40" height="40" class="img-responsive"></span><h2 id="firstHeading" class="firstHeading">' + name + '</h2></a>' +
      '<div id="bodyContent">' +
        '<p>' + locationString + '<p>' +
      '</div>' +
    '</div>';
    return contentString;
}

function initMap() {
  if (($('#map').length) > 0) {
    // google.maps.controlStyle = 'azteca' // allow 'old-style' Pan Controls w/ new map; thru Aug '16
    // var map;
    myLatLng = {lat: 37.784580, lng: -122.397437};
    map = new google.maps.Map(document.getElementById('map'), {
      center: myLatLng,
      zoom: 11,
      fullscreenControl: false,
      // panControl: true, // doesn't work even with 'azteca' - forget about it
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    var defaultBounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(37.784580, -122.397437),
      new google.maps.LatLng(37.784580, -122.397437)
    );
    var options = { bounds: defaultBounds };
    }
};


function toggleView() {
  $("#toggle-view").on("click", function(event) {
    event.preventDefault();
    if ($('#map-view').is(':hidden')) {
      $('#grid-view').hide();
      $('#map-view').show();
      $('#toggle-view')[0].text = "Show as Grid"
    } else {
      $('#map-view').hide();
      $('#grid-view').show();
      $('#toggle-view')[0].text = "Show as Map"
    }
  })
}
