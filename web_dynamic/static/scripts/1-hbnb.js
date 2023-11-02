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
});
