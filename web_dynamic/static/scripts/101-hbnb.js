#!/usr/bin/node

const amenities = {};
const states = {};
const cities = {};
function setAmenities() {
  $('.amenities input:checkbox').click(function () {
    const amenityId = $(this).data('id');
    const amenityName = $(this).data('name');

    if ($(this).is(':checked')) {
      amenities[amenityId] = amenityName;
    } else {
      delete amenities[amenityId];
    }
    const amenityList = Object.values(amenities).join(', ');
    if (amenityList.length > 45) {
      $('.amenities h4').text(amenityList.substring(0, 45) + '...');
    } else {
      $('.amenities h4').text(amenityList);
    }
    if ($.isEmptyObject(amenities)) {
      $('.amenities h4').html('&nbsp;');
    }
  });
}

function setStates() {
  $('.state input:checkbox').click(function () {
    const stateId = $(this).data('id');
    const stateName = $(this).data('name');

    if ($(this).is(':checked')) {
      states[stateId] = stateName;
    } else {
      delete states[stateId];
    }
    const statesList = Object.values(states).join(', ');
    if (statesList.length > 45) {
      $('.locations h4').text(statesList.substring(0, 45) + '...');
    } else {
      $('.locations h4').text(statesList);
    }
    if ($.isEmptyObject(states) && $.isEmptyObject(cities)) {
      $('.locations h4').html('&nbsp;');
    }
  });
}

function setCities() {
  $('.cities input:checkbox').click(function () {
    const cityId = $(this).data('id');
    const cityName = $(this).data('name');

    if ($(this).is(':checked')) {
      cities[cityId] = cityName;
    } else {
      delete cities[cityId];
    }
    const citiesList = Object.values(cities).join(', ');
    if (citiesList.length > 45) {
      $('.locations h4').text(citiesList.substring(0, 45) + '...');
    } else {
      $('.locations h4').text(citiesList);
    }
    if ($.isEmptyObject(states) && $.isEmptyObject(cities)) {
      $('.locations h4').html('&nbsp;');
    }
  });
}

function getStatus() {
  $.get('http://0.0.0.0:5001/api/v1/status/', function (data) {
    if (data.status === 'OK') {
      $('div#api_status').addClass('available');
    } else {
      $('div#api_status').removeClass('available');
    }
  });
}
function getPlaces(params = {}) {
  $.ajax({
    type: 'POST',
    url: 'http://0.0.0.0:5001/api/v1/places_search/',
    contentType: 'application/json',
    data: JSON.stringify(params),
    dataType: 'json',
    success: function (places) {
      const placesSection = $('section.places');
			placesSection.empty();

      places.forEach((place) => {
        placesSection.append(`<article>
				<div class="title_box">
					<h2>${place.name}</h2>
					<div class="price_by_night">$${place.price_by_night}</div>
				</div>
				<div class="information">
					<div class="max_guest">${place.max_guest} Guest${
          place.max_guest != 1 ? 's' : ''
        }</div>
					<div class="number_rooms">${place.number_rooms} Bedroom${
          place.number_rooms != 1 ? 's' : ''
        }</div>
					<div class="number_bathrooms">${place.number_bathrooms} Bathroom${
          place.number_bathrooms != 1 ? 's' : ''
        }</div>
				</div>
				<div class="description">
					${place.description}
				</div>
        <div class="reviews" data-id="${place.id}">
          <h2>Reviews</h2>
	    <span data-id="${place.id}" onclick="showHideReview(\'${place.id}\');">show</span>
            <ul data-id="${place.id}"></ul>
        </div>
			</article>`);
      });
    },
  });
}

function dayOrdinal(day) {
	if (day > 3 && day < 21)
		return (day + 'th');
	switch (day % 10) {
		case 1:  return (day + "st");
		case 2:  return (day + "nd");
		case 3:  return (day + "rd");
		default: return (day + "th");
	}
}

function showHideReview(placeId) {
	showHide = $(`span[data-id|=${placeId}]`);
	if (showHide.text() == "show") {
		showHide.text("hide");
		const url = `http://0.0.0.0:5001/api/v1/places/${placeId}/reviews`
		$.get(url, function(data) {
			$(`.reviews[data-id|=${placeId}] h2`).html(`${data.length} Reviews`);
			for (const review of data) {
				let userName = ""
				if (review.user_id) {
					const userUrl = `http://0.0.0.0:5001/api/v1/users/${review.user_id}`;
					$.get(userUrl, function (userData, status) {
						if (status == "success") {
							userName = `${userData.first_name} ${userData.last_name}`;
						}
					});
					const date = new Date(review.created_at);
					const month = date.toLocaleString('en', { month: 'long' });
					const day = dayOrdinal(date.getDate());
					$(`.reviews[data-id|=${placeId}] ul`).append(`
					<li>
						<h3>From ${userName} the ${day + ' ' + month + ' ' + date.getFullYear()}</h3> 
						<p>${review.text}</p>
					</li>
					`);
				}
			}
		});
	} else {
		showHide.text("show");
		$(`.reviews[data-id|=${placeId}] ul`).empty();
		$(`.reviews[data-id|=${placeId}] h2`).html("Reviews");
	}
}

function setupSearch() {
  const button = $('button');
  button.click(function () {
    getPlaces({ 
      amenities: Object.keys(amenities),
      states: Object.keys(states),
      cities: Object.keys(cities)
    });
  });
}
$(document).ready(function () {
  setAmenities();
  setStates()
  setCities()
  getStatus();
  getPlaces();
  setupSearch();
  showHideReview();
});
