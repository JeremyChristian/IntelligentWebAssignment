var NO_RESULTS = "<h3>No Results</h3>";

var results; // this is the html element that will contain the results of queries

var markerTPD;
var radiusTPD;
var circle;
var mapTPD;
var socket = null;

/**
 * Smoothly scrolls to the given element
 * @param element the element to scroll to
 */
function scrollTo(element)
{
	$('html, body').animate({ // scroll to results
        scrollTop: element.offset().top - 130
    }, 1000);
}

/**
 * Clears the results area ready for population
 */
function prepareResults()
{
	results.empty(); // empty the results wrapper of elements
	if (socket != null)
		socket.emit('clear', {});
}

/**
 * Populates and shows the user profile modal with the given user
 * @param user the id of the user to show the profile for
 */
function showUserProfile(user)
{
	// specific user location query ajax request to server including form inputs
	$.ajax({
		url: "api/twit/user/" + user,
		accepts: "application/json; charset=utf-8",
		async: true,
		cache: false,
		method: "GET",
		error: function (jqXHR, status, error)
		{
			if (error == "")
				error = "unknown";

			// Produce an alert to show the error
			alert("An error occurred, please try again.\nReason: " + error + "\nStatus: " + status);
		},
		success: function (data, status, jqXHR)
		{
			var profile = "<div class='profile-md'>";

			profile += "<img class='img-thumbnail' src='" + data.img + "' />";

			profile += "<div>";

			profile += "<h3>" + data.name + "</h3>";

			if (data.username != undefined)
				profile += "<p>" + data.username + "</p>";

			if (data.location != undefined)
				profile += "<p>" + data.location + "</p>";

			profile += "</div><br class='clear' />";

			profile += "<p>" + data.description + "</p>";

			profile += "</div>";

			profile += "<h3>Last 100 Tweets</h3>";

			var tweets = data.tweets;

			for (var i=0; i<tweets.length; i++)
			{
				var date = new Date(tweets[i].time);
				var dateString = date.toDateString() + "  " + date.getUTCHours() + ":" + date.getUTCMinutes();

				// for each result, append to results wrapper
				profile += "<div class='result'>";
				profile += "<h3>" + data.username;
				profile += "<span class='date'>" + dateString + "</span>"
				profile += "</h3>"
				profile += "<p>" + tweets[i].msg + "</p>"
				profile += "</div>";
			}

			$("#user-profile-body").append(profile);

			$("#user-profile-modal").modal({backdrop: false, show: true});
		}
	});
}

/**
 * Populates and shows a modal with the users that have retweeted the tweet with the given id
 * @param id the id of the tweet to show retweets for
 */
function showRetweets(id)
{
	var container = $("#retweets-body");

	// retweets ajax request to server using the given id
	$.ajax({
		url: "api/twit/retweets/" + id,
		accepts: "application/json",
		async: true,
		cache: false,
		method: "GET",
		error: function (jqXHR, status, error)
		{
			if (error == "")
				error = "unknown";

			// Produce an alert to show the error
			alert("An error occurred, please try again.\nReason: " + error + "\nStatus: " + status);
		},
		success: function (data, status, jqXHR)
		{
			container.empty();

			if (data.length == 0)
				container.append("<p>No retweets to show</p>")

			for (var i=0; i<data.length; i++)
			{
				prependUserToElement({
					username: data[i].username,
					name: data[i].name,
					location: data[i].location,
					description: data[i].description,
					img: data[i].img
				}, container);

				/*
				var profile = "<div class='micro-profile'>";

				// add image to profile
				if (data[i].img != undefined && data[i].img != '')
					profile += "<img src='" + data[i].img + "' class='img-thumbnail' />";

				profile += "<div>";

				var name = data[i].name;
				//var username = data[i].username;
				var location = data[i].location;

				if (name != undefined && name != '')
					profile += "<p class='micro-profile-name'>Name: " + name + "</p>";

				//if (username != undefined && username != '')
				//	profile += "<p class='micro-profile-username'>Username: " + username + "</p>";

				if (location != undefined && location != '')
					profile += "<p class='micro-profile-location'>Location: " + location + "</p>";

				profile += "</div></div><hr class='clear'/>";

				container.append(profile);
				*/
			}

			$("#retweets-modal").modal({backdrop: false, show: true, });
		}
	});
}

/**
 * Appends a html representation of the given user to the given jquery element
 * @param user the user object to construct in html
 * @param element the element to prepend to 
 */
function prependUserToElement(user, element)
{
	var html = "<div class='profile-md' vocab='ontology.xml' typeof='User'>";

	html += "<img class='img-thumbnail' src='" + user.img + "' property='userProfilePicture' />";

	html += "<div>";

	html += "<h3 property='userName'>" + user.name + "</h3>";

	if (user.username != undefined)
		html += "<p property='userID'>" + user.username + "</p>";

	if (user.location != undefined)
		html += "<p property='userLocation'>" + user.location + "</p>";

	html += "</div>";

	if (user.username != undefined)
		html += "<a class='user-profile-button btn btn-sm btn-info fl-right' data-username='" + user.username + "'>View User</a>";

	html += "<br class='clear' />";

	html += "<p property='userDescription'>" + user.description + "</p>";

	html += "</div>";

	element.prepend(html);
}

/**
 * Appends a html representation of the given venue to the given jquery element
 * @param venue the venue object to construct in html
 * @param element the element to prepend to
 */
function prependVenueToElement(venue, element)
{
	var html = "<hr /><div class='location' vocab='ontology.xml' typeof='Venue'><div>";

	html += "<div class='location-image-container'><img class='img-thumbnail' src='" + venue.img + "' property='venuePhoto' /></div>";

	html += "<div class='location-name-cat'><h3>";

	html += "<meta property='venueURL' content='" + venue.url + "' />";

	html += "<a href='" + venue.url + "' target='_blank' property='venueName' >";

	html += venue.venue;

	html += "</a>";

	html += "</h3><p property='venueCategory'>" + venue.category + "</p>";

	html += "</div></div><br class='clear' />";

	html += "<p class='location-subtitle'>Address</p><p property='venueAddress'>" + venue.address + "</p>";

	html += "<p class='location-subtitle'>Description</p><p property='venueDescription'>" + venue.description + "</p>";

	html += "<br /><a class='btn btn-sm btn-info poibutton' data-poi-lat='" + venue.lat + "' data-poi-lon='" + venue.lon + "' data-poi-venue='" + venue.venue + "' data-poi-url='" + venue.url + "'>Show points of interest</a>";
	
	html += "</div>";

	element.prepend(html);
}

/**
 * Appends a html representation of the given tweet to the given jquery element
 * @param tweet the tweet to construct in html
 * @param element the element to prepend to
 */
function prependTweetToElement(tweet, element)
{
	var date = new Date(tweet.time);
	var dateString = date.toDateString() + "  " + date.getUTCHours() + ":" + date.getUTCMinutes();

	var html = "<div class='result'>";

	html += "<a class='retweets-button btn btn-sm btn-info fl-right lmarg' data-retweet=" + tweet.id + ">View Retweets (" + tweet.retweet_count + ")</a>";

	html += "<a class='user-profile-button btn btn-sm btn-info fl-right' data-username='" + tweet.username + "'>View User</a>"

	html += "<h3>" + tweet.username;

	html += "<span class='date'>" + dateString + "</span>";

	html += "</h3><p>" + tweet.msg + "</p></div>";

	element.prepend(html);
}

/**
 * Defines what to do when the window has loaded
 */
$(function() {
	results = $('#results-wrapper'); // get the results wrapper element

	$('#twit-tpd-form').submit(onTPDFormSubmit);
	$('#twit-sukq-form').submit(onSUKQFormSubmit);
	$('#twit-sulq-form').submit(onSULQFormSubmit);
	$('#twit-vvq-form').submit(onVVQFormSubmit);

	prepareResults();

	initTPDMap();

	// makes the clear results button clear the results
	$("#results-clearer").click(function() {
		prepareResults();
	});

	$(".twit-form-tab").click(function() {
		prepareResults();

	});
	
});

/**
 * Defines what to do when the track public discussions form is submitted
 */
function onTPDFormSubmit()
{
	// Get the values from the form
	var search = $('#twit-tpd-input-search').val();
	var latitude = $('#twit-tpd-input-latitude').val();
	var longitude = $('#twit-tpd-input-longitude').val();
	var radius = $('#twit-tpd-input-radius').val();
	var units = $('#twit-tpd-input-units').val();
	var stream = $('#twit-tpd-input-stream').is(':checked');

	//alert("Search: " + search + "\nLatitude: " + latitude + "\nLongitude: " + longitude + "\nRadius: " + radius + " " + units);

	if (search == "")
	{
		alert("Please enter a query");
		return;
	}

	// construct form data JSON object to send to server
	var formData = {
			q: search,
			lat: latitude,
			lon: longitude,
			radius: radius + units
		};

	// modify object if lat/lon have not been entered
	if (latitude == "" || longitude == "")
		formData = {
			q: search
		}

	// track public discussions ajax request to server including form inputs
	$.ajax({
		url: "api/twit/status",
		accepts: "application/json; charset=utf-8",
		async: true,
		cache: false,
		contentType: "application/json; charset=utf-8",
		method: "GET",
		data: formData,
		error: function (jqXHR, status, error)
		{
			if (error == "")
				error = "unknown";

			// Produce an alert to show the error
			alert("An error occurred, please try again.\nReason: " + error + "\nStatus: " + status);
		},
		success: function (data, status, jqXHR)
		{
			prepareResults();

			if (data.length == 0)
			{
				results.append(NO_RESULTS);
				return;
			}

			for (var i=0; i<data.length; i++)
			{
				// prepend individual tweet to the 
				prependTweetToElement({
					id: data[i].id,
					username: data[i].username,
					name: data[i].name,
					time: data[i].time,
					geo: data[i].geo,
					retweet_count: data[i].retweet_count,
					msg: data[i].msg
				}, results);
			}

			// makes view retweets button call the function to show the retweets
			$(".retweets-button").click(function() {
				var id = $(this).attr("data-retweet");
				showRetweets(id);
			});

			// makes the view user profile button call the function to show the user profile
			$(".user-profile-button").click(function() {
				var username = $(this).attr("data-username");
				showUserProfile(username);
			});

			scrollTo(results); // smoothly scrolls to the results
		}
	});
}

/**
 * Defines what to do when the specific user keyword query form is submitted
 */
function onSUKQFormSubmit()
{
	// Get the values from the form
	var screenName = $('#twit-sukq-input-screen-name').val();
	var keywordCount = $('#twit-sukq-input-keyword-count').val();
	var dayCount = $('#twit-sukq-input-day-count').val();
	
	//alert("Screen Names: " + screenName + "\nKeyword Count: " + keywordCount + "\nDays: " + dayCount);

	screenName = screenName.replace('@', ''); // remove @ signs from user names

	var screenNames = screenName.split(',');

	// Trim the screen names of whitespace
	for (var i=0; i<screenNames.length; i++)
		screenNames[i] = screenNames[i].trim();

	// specific user query ajax request to server including form inputs
	$.ajax({
		url: "api/twit/users/topics",
		accepts: "application/json; charset=utf-8",
		async: true,
		cache: false,
		contentType: "application/json; charset=utf-8",
		method: "GET",
		data:
		{
			users: screenName,
			keywords: keywordCount,
			days: dayCount
		},
		error: function (jqXHR, status, error)
		{
			if (error == "")
				error = "unknown";

			// Produce an alert to show the error
			alert("An error occurred, please try again.\nReason: " + error + "\nStatus: " + status);
		},
		success: function (data, status, jqXHR)
		{
			//alert(JSON.stringify(data));

			prepareResults();

			var table = "<table class='table table-striped table-hover'><tr><th>Keyword</th>";

			// apply table headings
			for (var i=0; i<screenNames.length; i++)
				table += "<th>" + screenNames[i] + "</th>";

			table += "</tr>";

			// for each result, append row to table
			for (var key in data)
			{
				table += "<tr><td>" + key + "</td>";

				for (var i=0; i<screenNames.length; i++)
				{
					var user = screenNames[i];
					var termData = data[key];
					var value = termData[user];
					table += "<td>" + value + "</td>";
				}

				table += "</tr>";
			}

			table += "</table>";

			results.append(table);

			scrollTo(results); // smoothly scroll to the results
		}
	});
}

/**
 * Defines what to do when the specific user location query form is submitted
 */
function onSULQFormSubmit()
{
	// Get the values from the form
	var screenName = $('#twit-sulq-input-screen-name').val();
	var dayCount = $('#twit-sulq-input-day-count').val();
	
	screenName = screenName.replace('@', ''); // remove @ signs from user names

	// if days is 0, use socket io with the server which uses the twitter streaming api to provide real time results
	if (dayCount == 0)
	{
		prepareResults(); // empty the results wrapper

		results.append("<h3>Streaming...</h3>");

		var locations = $("<div class='col-sm-5' />");

		results.append("<div class='col-sm-7' id='map-canvas'></div>");

		results.append(locations);

		var map = new google.maps.Map(document.getElementById('map-canvas'), {
			center: { lat: 0, lng: 0},
			streetViewControl: false,
			zoom: 2});

		var bounds = new google.maps.LatLngBounds();

		socket = io.connect(window.location.host); // construct new socket

		socket.emit('user/places', {user: screenName}); // tell the server what screen name to look for tweets from

		// process the checkin when it is received
		socket.on('user/places', function(data) {
			prependVenueToElement(data, locations);

			var lat = data.lat;
			var lon = data.lon;
			var name = data.venue;

			var marker = new google.maps.Marker({
				position: new google.maps.LatLng(lat, lon),
				title: name,
				url: data.url
			});

			marker.setMap(map);

			bounds.extend(marker.position);

			if (data.url != undefined && data.url != "")
				google.maps.event.addListener(marker, 'click', function() {
					if(this.url != "")
					{
						var win = window.open(this.url, '_blank');
						if(win)
							win.focus();
						else
							window.location.href = this.url;
					}
				});

			map.fitBounds(bounds);
		});

		socket.on('error', function(data) {
			alert(data.error);
		});

		scrollTo(results); // smoothly scroll to the results

		return;
	}
			
	//alert("Screen Name: " + screenName + "\nDays: " + dayCount);

	// specific user location query ajax request to server including form inputs
	$.ajax({
		url: "api/user/places",
		accepts: "application/json; charset=utf-8",
		async: true,
		cache: false,
		contentType: "application/json; charset=utf-8",
		method: "GET",
		data:
		{
			user: screenName,
			days: dayCount
		},
		error: function (jqXHR, status, error)
		{
			if (error == "")
				error = "unknown";

			// Produce an alert to show the error
			alert("An error occurred, please try again.\nReason: " + error + "\nStatus: " + status);
		},
		success: function (data, status, jqXHR)
		{
			//alert(JSON.stringify(data));

			prepareResults();

			if (data.length == 0)
			{
				results.append("<p>No checkins</p>");
				return;
			}

			var locations = $("<div class='col-md-5' />");

			// add venue information to the locations column for each venue
			for (var key in data)
			{
				prependVenueToElement(data[key], locations);
			}

			results.append(locations);

			results.append("<div class='col-md-7' id='map-canvas'></div>");

			// create the map and initialize it
			var map = new google.maps.Map(document.getElementById('map-canvas'), {
			center: { lat: 0, lng: 0},
			streetViewControl: false,
			zoom: 2});

			var bounds = new google.maps.LatLngBounds();

			// for all venues, add marker to map
			for (var key in data)
			{
				var lat = data[key].lat;
				var lon = data[key].lon;
				var name = data[key].venue;

				var marker = new google.maps.Marker({
					position: new google.maps.LatLng(lat, lon),
					title: name,
					url: data[key].url
				});

				marker.setMap(map);

				// set the bounds of the map to also include the marker
				bounds.extend(marker.position);

				// make the marker clickable and send user to the url if it exists
				if (data[key].url != undefined && data[key].url != "")
					google.maps.event.addListener(marker, 'click', function() {
						if(this.url != "")
						{
							var win = window.open(this.url, '_blank');
							if(win)
								win.focus();
							else
								window.location.href = this.url;
						}
					});
			}

			map.fitBounds(bounds); // set the bounds of the map

			scrollTo(results); // smoothly scroll to the results

			// make each button for points of interest call the function to find points of interest
		    $(".poibutton").click(function() {
		    	var lat = $(this).attr("data-poi-lat");
		    	var lon = $(this).attr("data-poi-lon");
		    	var venue = $(this).attr("data-poi-venue");
		    	var url = $(this).attr("data-poi-url");
		    	getPointsOfInterest({lat: lat, lon: lon, venue: venue, url: url});
		    });
		}
	});
}

/**
 * Defines what to do when the venue visit query form is submitted
 */
function onVVQFormSubmit()
{
	// Get the values from the form
	var location = $('#twit-vvq-input-location').val();
	var dayCount = $('#twit-vvq-input-day-count').val();
			
	//alert("Location: " + location + "\nDays: " + dayCount);

	// venue visit query ajax request to server including form inputs
	$.ajax({
		url: "api/place/users",
		accepts: "application/json; charset=utf-8",
		async: true,
		cache: false,
		contentType: "application/json; charset=utf-8",
		method: "GET",
		data:
		{
			location: location,
			days: dayCount
		},
		error: function (jqXHR, status, error)
		{
			if (error == "")
				error = "unknown";

			// Produce an alert to show the error
			alert("An error occurred, please try again.\nReason: " + error + "\nStatus: " + status);
		},
		success: function (data, status, jqXHR)
		{
			//alert(JSON.stringify(data));

			prepareResults();

			var profilesCol1 = $("<div class='col-md-6' />");

			// populate first column with users
			for (var i=0; i<data.length / 2; i++)
			{
				prependUserToElement({
					username: data[i].username,
					name: data[i].name,
					location: data[i].location,
					description: data[i].description,
					img: data[i].img
				}, profilesCol1);
			}

			var profilesCol2 = $("<div class='col-md-6' />");

			// populate second column with users
			for (var i=Math.ceil(data.length / 2); i<data.length; i++)
			{				
				prependUserToElement({
					username: data[i].username,
					name: data[i].name,
					location: data[i].location,
					description: data[i].description,
					img: data[i].img
				}, profilesCol2);
			}

			// law of averages means columns should be similar length (hopefully)

			// append the results to the results wrapper
			results.append(profilesCol1);
			results.append(profilesCol2);

			// make each button for view user profile call the function to show the user profile
			$(".user-profile-button").click(function() {
				var username = $(this).attr("data-username");
				showUserProfile(username);
			});
		}
	});

}

/**
 * Initialises the map for the tracking public discussions
 */
function initTPDMap()
{
	circle = null;

	// construct the map and initialize it
	mapTPD = new google.maps.Map(document.getElementById('twit-tpd-input-map'), {
		center: { lat: 0, lng: 0},
		streetViewControl: false,
		zoom: 1
	});

	markerTPD = null;

	radiusTPD = $("#twit-tpd-input-radius").val() * 1000; // get the radius in metres

	if ($("#twit-tpd-input-units").val() == "mi")
		radiusTPD *= 1.609344; // convert to miles (if miles selected)

	// when the map is clicked, add a marker and circle showing radius
	google.maps.event.addListener(mapTPD, 'click', function(event) {

		// remove the last marker from the map
		if (markerTPD != null)
			markerTPD.setMap(null);

		// construct a new marker at the location clicked
		markerTPD = new google.maps.Marker({
        	position: event.latLng, 
        	map: mapTPD
    	});

		// set the latitude and logitude in the form from the marker
    	$("#twit-tpd-input-latitude").val(event.latLng.lat());
    	$("#twit-tpd-input-longitude").val(event.latLng.lng());

		markerTPD.setMap(mapTPD); // apply the marker to the map

		// remove the last circle from the map
		if (circle != null)
			circle.setMap(null);

		// create circle at the marker with the radius from the form
		circle = new google.maps.Circle({
			map: mapTPD,
			radius: radiusTPD,
			fillColor: '#44FF44'
		});
		circle.bindTo('center', markerTPD, 'position'); // apply circle to marker
	});

	// when radius of units changed, apply the change to the circle radius
	$("#twit-tpd-input-radius").change(adjustRadiusTPD);
	$("#twit-tpd-input-units").change(adjustRadiusTPD);
}

/**
 * Adjusts the radius on the map for tracking public discussions
 */
function adjustRadiusTPD()
{
	radiusTPD = $("#twit-tpd-input-radius").val() * 1000; // get the raidus in metres

	if ($("#twit-tpd-input-units").val() == "mi")
		radiusTPD *= 1.609344; // convert to miles (if miles selected)

	if (markerTPD != null)
	{
		// remove circel from map
		if (circle != null)
			circle.setMap(null);

		// creates the new circle
		circle = new google.maps.Circle({
			map: mapTPD,
			radius: radiusTPD,
			fillColor: '#44FF44'
		});
		circle.bindTo('center', markerTPD, 'position'); // applies the circle to the marker
	}
}

/**
 * Get the points of interest to the given venue and forward the information to populate the points of interest modal
 * @param venue the venue object to get points of interest around
 */
function getPointsOfInterest(venue)
{
	// points of interest ajax request to server for json of nearby venues
	$.ajax({
		url: "api/place/places",
		accepts: "application/json; charset=utf-8",
		async: true,
		cache: false,
		contentType: "application/json; charset=utf-8",
		method: "GET",
		data:
		{
			lat: venue.lat,
			lon: venue.lon
		},
		error: function (jqXHR, status, error)
		{
			if (error == "")
				error = "unknown";

			// Produce an alert to show the error
			alert("An error occurred, please try again.\nReason: " + error + "\nStatus: " + status);
		},
		success: function (data, status, jqXHR)
		{
			showPointsOfInterest(venue, data);
		}
	});
}

/**
 * Displays the given venues on a map within the points of interest modal
 * @param currentVenue the venue object to show points of interest around
 * @param venues the list of venues objects representing the points of interest
 */
function showPointsOfInterest(currentVenue, venues)
{
	var container = $("#points-of-interest-body"); // the points of interest container

	container.empty(); // remove all elements from container

	container.append("<div id='map-canvas-modal'></div>"); // append the map to the points of interest container

	$("#points-of-interest-modal").modal({backdrop: false, show: true}); // show the modal

	// create the map and initialize it
	var map = new google.maps.Map(document.getElementById('map-canvas-modal'), {zoom: 8});

	var bounds = new google.maps.LatLngBounds();

	// apply a marker to the map for every local venue
	for (var key in venues)
	{
		var lat = venues[key].lat;
		var lon = venues[key].lon;
		var name = venues[key].venue;
		var icon = "http://maps.google.com/mapfiles/ms/icons/red-dot.png" // default and always defined
		
		switch(venues[key].source)
		{
			case "4sq":
				icon = "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png";
				break;

			case "dbp":
				icon = "http://maps.google.com/mapfiles/ms/icons/blue-dot.png";
				break;
		}

		// create the marker
		var marker = new google.maps.Marker({
			position: new google.maps.LatLng(lat, lon),
			title: name,
			url: venues[key].url,
			icon: icon
		});

		// when the marker is clicked, forward user to the venue website
		google.maps.event.addListener(marker, 'click', function() {
			if(this.url != "")
			{
				var win = window.open(this.url, '_blank');
				if(win)
					win.focus();
				else
					window.location.href = this.url;
			}
		});

		marker.setMap(map); // puts the marker on to the map

		bounds.extend(marker.position); // extend the map boundries to fit the marker within it
	}
	
	// create the marker
	var marker = new google.maps.Marker({
		position: new google.maps.LatLng(currentVenue.lat, currentVenue.lon),
		title: currentVenue.venue,
		url: currentVenue.url,
		icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
	});

	// when the marker is clicked, forward user to the venue website
	google.maps.event.addListener(marker, 'click', function() {
		if(this.url != "")
		{
			var win = window.open(this.url, '_blank');
			if(win)
				win.focus();
			else
				window.location.href = this.url;
		}
	});

	var legend = $(document.createElement('div'));

	legend.attr('id', 'poi-legend');

	legend.append("<img src='http://maps.google.com/mapfiles/ms/icons/green-dot.png'> Current Venue <br>");
	legend.append("<img src='http://maps.google.com/mapfiles/ms/icons/yellow-dot.png'> Foursquare Venue <br>");
	legend.append("<img src='http://maps.google.com/mapfiles/ms/icons/blue-dot.png'> DBPedia Venue <br>");

	map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(legend.get(0));
	

	marker.setMap(map); // puts the marker on to the map

	bounds.extend(marker.position); // extend the map boundries to fit the marker within it

	map.fitBounds(bounds); // apply the map boundries
}