var resultsWrapper;

/**
 * Calls for the system to be initialised when the DOM is ready
 */
$(function() {
	init();
});

/**
 * Prepares the results wrapper for population
 */
function prepareResultsWrapper()
{
	resultsWrapper.empty(); // empty the data.venues wrapper of elements

	resultsWrapper.append("<h2 id='results-heading'>Results <a id='results-clearer' class='fl-right btn btn-sm btn-info'>Clear Results</a></h2>"); // apply heading

	$("#results-clearer").click(function() {
		prepareResultsWrapper();
	});
}

/**
* Initialises the system
*/
function init()
{
	resultsWrapper = $('#results-wrapper');

	// submit forms on button clicks
	$("#db-query-user-form").submit(submitUserQuery);
	$("#db-query-location-form").submit(submitLocationQuery);

	prepareResultsWrapper();
}

/**
 * Submits the user query form
 */
function submitUserQuery()
{
	var search = $("#db-query-user-username").val();

	// Send an ajax request to the server to query the database using the given data
	$.ajax({
		url: "api/db/users",
		accepts: "application/json; charset=utf-8",
		async: true,
		cache: false,
		contentType: "application/json; charset=utf-8",
		method: "GET",
		data:
		{
			user: search
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
			populateUsers(resultsWrapper, data);
		}
	});
}

/**
 * Submits the location query form
 */
function submitLocationQuery()
{
	var search = $("#db-query-location-location").val();

	// Send an ajax request to the server to query the database using the given data
	$.ajax({
		url: "api/db/venue",
		accepts: "application/json; charset=utf-8",
		async: true,
		cache: false,
		contentType: "application/json; charset=utf-8",
		method: "GET",
		data:
		{
			location: search
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
			populateVenues(resultsWrapper, data);
		}
	});
}

/*
 * Populates the data.venues wrapper with the given array of users
 */
function populateUsers(wrapper, data)
{
	wrapper.empty(); // empty the element that will contain the results

	if (wrapper == resultsWrapper)
		prepareResultsWrapper(); // prepare the results wrapper if necessary

	if (data.username == undefined || data.name == undefined)
	{
		wrapper.append("<p>No results</p>");
		return;
	}

	// construct the user profile in html
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

	wrapper.append(profile); // append profile to results container

	// construct user venues in html
	var venues = "<hr /><h3>Venues:</h3>";

	if (data.venues.length == 0)
		venues += "<p>No venue checkins recorded</p>"; // if nothing, tell them there are no venues recorded
	
	else {

		venues += "<div>";

		for (var key in data.venues)
		{
			var img = data.venues[key].img;
			var venue = data.venues[key].name;
			var cat = data.venues[key].category;
			var address = data.venues[key].address;
			var url = data.venues[key].url;
			var description = data.venues[key].description;

			venues += "<hr /><div class='location'><div>";

			if (img != undefined && img != "")
				venues += "<div class='location-image-container'><img class='img-thumbnail' src='" + img + "' /></div>";

			venues += "<div class='location-name-cat'>";
			venues += "<h3><a href='" + url + "' target='_blank'>" + venue + "</a></h3>";
			venues += "<p>" + cat + "</p>";
			venues += "</div></div><br class='clear' />";

			venues += "<p class='location-subtitle'>Address</p><p>" + address + "</p>";
			venues += "<p class='location-subtitle'>Description</p><p>" + description + "</p>";
			venues += "</div>";
		}

		venues += "</div>";

	}

	wrapper.append(venues); // append the venues to the results container

	// construct the user interactions in html
	var interactions = "<hr /><h3>Interactions:</h3>";

	if (data.interactions.length == 0)
		interactions += "<p>No interactions recoreded</p>";
	
	else for (var key in data.interactions)
	{
		interactions += "<div class='profile-md'>";
		interactions += "<img class='img-thumbnail' src='" + data.interactions[key].img + "' />";
		interactions += "<div>";
		interactions += "<h3>" + data.interactions[key].name + "</h3>";

		if (data.username != undefined)
			interactions += "<p>" + data.interactions[key].username + "</p>";

		if (data.location != undefined)
			interactions += "<p>" + data.interactions[key].location + "</p>";

		interactions += "</div><br class='clear' />";
		interactions += "<p>" + data.interactions[key].description + "</p>";
		interactions += "</div>";

	}

	wrapper.append(interactions); // append the user interactions to the results cntainer
}

/*
 * Populates the results wrapper with the results of the venues query
 */
function populateVenues(wrapper, data)
{
	wrapper.empty(); // empty the element that will contain the results

	if (wrapper == resultsWrapper)
		prepareResultsWrapper(); // prepare the results wrapper if necessary

	// if no venues, tell user
	if (data.venue == undefined)
	{
		wrapper.append("<p>No venues of that name have been recorded</p>");
		return;
	}

	// construct the location profile
	var locations = "<div>";
	locations += "<hr /><div class='location'><div>";

	if (data.img != undefined && data.img != "")
		locations += "<div class='location-image-container'><img class='img-thumbnail' src='" + data.img + "' /></div>";

	locations += "<div class='location-name-cat'><h3>";

	if (data.url != undefined && data.url != "")
		locations += "<a href='" + data.url + "' target='_blank'>";

	locations += data.venue;

	if (data.url != undefined && data.url != "")
		locations += "</a>";

	locations += "</h3><p>" + data.cat + "</p>";
	locations += "</div></div><br class='clear' />";
	locations += "<p class='location-subtitle'>Address</p><p>" + data.address + "</p>";
	locations += "<p class='location-subtitle'>Description</p><p>" + data.description + "</p>";
	locations += "</div>";
	locations += "</div>";

	wrapper.append(locations); // append location profile to the results container

	// construct the html for showing the users that recently visited the venue
	var users = "<hr /><h3>Users Recently Visited</h3>";

	if (data.users.length == 0)
		users += "<p>No users have recently visited this venue</p>";

	// for each profile in users, construct a html profile for them
	else for (var key in data.users)
	{
		var profile = "<div class='profile-md'>";

		if (data.users[key].img != undefined && data.users[key].img != "")
			profile += "<img class='img-thumbnail' src='" + data.users[key].img + "' />";

		profile += "<div>";
		profile += "<h3>" + data.users[key].name + "</h3>";

		if (data.users[key].username != undefined)
			profile += "<p>" + data.users[key].username + "</p>";

		if (data.users[key].location != undefined)
			profile += "<p>" + data.users[key].location + "</p>";

		profile += "</div>";

		if (data.users[key].username != undefined)
			profile += "<a class='user-profile-button btn btn-sm btn-info fl-right' data-username='" + data.users[key].username + "'>View User</a>";

		profile += "<br class='clear' />";
		profile += "<p>" + data.users[key].description + "</p>";
		profile += "</div>";
		users += profile;
	}

	wrapper.append(users); // append all user profiles to the results container element

	$(".user-profile-button").click(function() {
		var username = $(this).attr("data-username");

		// Send an ajax request to the server to query the database using the given data
		$.ajax({
			url: "api/db/users",
			accepts: "application/json; charset=utf-8",
			async: true,
			cache: false,
			contentType: "application/json; charset=utf-8",
			method: "GET",
			data:
			{
				user: username
			},
			error: function (jqXHR, status, error)
			{
				alert("An error occurred, please try again.\nReason: " + error);
			},
			success: function (data, status, jqXHR)
			{
				populateUsers($("#db-modal-body"), data);
				$("#user-profile-modal").modal({backdrop: false, show: true});
			}
		});
	});
}