var requestSettings;

$( "#submitFoodItemId" ).click(function() {
	$('.results').fadeOut();
  getFoodItem( $('#foodItemId').val() ) ;
});


getFoodItem = function( itemId ){
	requestSettings = {
  "async": true,
  "crossDomain": true,
  "url": "http://govhacksapi.herokuapp.com/stuff/" + itemId ,
  "method": "GET",

}

$.ajax(requestSettings).done(function (response) {
	updatePage(response);
});
}


updatePage = function(r){

	 $('#foodName').text(r.foodName);
	 $('#foodCategory').text(r.foodCategory);
	 $('#locationName').text(r.steps[0].locationName);
	 $('#facilityName').text(r.steps[0].facilityName);
	 $('.map').html(
	 	'<iframe width="300" height="170" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://maps.google.com/maps?q='+r.steps[0].geoloc.lat+','+r.steps[0].geoloc.long+'&hl=es;z=14&amp;output=embed"></iframe>'
	 )

	 for(var i = 0; i < r.steps.length; i++){

	 	var locationName = r.steps[i].locationName;
	 	var lat = r.steps[i].geoloc.lat;
	 	var lon = r.steps[i].geoloc.lon;
    	var dateIn = r.steps[i].dateIn;
    	var dateOut = r.steps[i].dateOut
    	var facilityName = r.steps[i].facilityName;
        var facilityAccredation = r.steps[i].facilityAccredation;
        var conditionIn = r.steps[i].conditionIn;
        var conditionOut = r.steps[i].conditionOut; 
        var facilityChemicals = r.steps[i].facilityChemicals;
        var facilityAllergens = r.steps[i].facilityAllergens;
        var stepLabel = 1+i;

        $('.steps').append('<div class = row><div class = "col-md-4"><h4>'+stepLabel+'</h4><h5>'
         + locationName +'</h5><h5>' + facilityName + '</h5><h5>'+ facilityAccredation+ 
         '</h5></div><div class = "col-md-4"><h4>Allergens</h4><h5>' + facilityAllergens + 
         '</h5><h4>Chemicals</h4><h5>'+ facilityChemicals + '</h5></div><div class = "col-md-4"><h4>Date In: ' + 
         dateIn + '</h4><h4>Date Out: ' + dateOut + '</h4><h4>Condition In:<br>' + conditionIn +
         '</h4><h4>Condition Out:<br>' + conditionOut + '</h4></div>');

	 }

	 $('.results').fadeIn();

}