#!/usr/bin/node

$(document).ready(function () {
  const amenities = {};
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
  $.get('http://0.0.0.0:5001/api/v1/status/', function (data) {
    if (data.status === 'OK') {
      $('div#api_status').addClass('available');
    } else {
      $('div#api_status').removeClass('available');
    }
  });
  $.ajax({
    type: 'POST',
    url: 'http://0.0.0.0:5001/api/v1/places_search/',
    contentType: 'application/json',
    data: '{}',
    dataType: 'json',
    success: function (places) {
      const placesSection = $('section.places');

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
			</article>`);
      });
    },
  });
});
