var requestSettings;
var json;

$( "#submitFoodItemId" ).click(function() {
	$('.results').fadeOut();
  	getFoodItem( $('#foodItemId').val() ) ;
});

$("#showChain").click(function(){

	$('.p1').fadeOut(function(){
		$('.p2').fadeIn();
	});

	buildChart();

})

$("#backPage").click(function(){

	$('.p2').fadeOut(function(){
		$('.p1').fadeIn();
	});

})

getFoodItem = function( itemId ){
	requestSettings = {
  "async": true,
  "crossDomain": true,
  "url": "http://govhacksapi.herokuapp.com/scan/" + itemId ,
  "method": "GET",
}

$.ajax(requestSettings).done(function (response) {
	json = response;
	updatePage(response);
});
}


updatePage = function(r){
	console.log(r);
	 $('#foodName').text(r.name);
	 $('#locationName').text(r.stamps[0].locationName);
	 $('#facilityName').text(r.stamps[0].facilityName);
	 $('.map').html(
	 	'<iframe width="240" height="240" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://maps.google.com/maps?q='+r.stamps[0].geoloc.lat+','+r.stamps[0].geoloc.long+'&hl=es;z=14&amp;output=embed"></iframe>'
	 )

	 for(var i = 0; i < r.stamps.length; i++){

	 	var locationName = r.stamps[i].locationName;
	 	var lat = r.stamps[i].geoloc.lat;
	 	var lon = r.stamps[i].geoloc.lon;
    	
    	var facilityName = r.stamps[i].facilityName;
        
        var chemicalContaminents = r.stamps[i].chemicalContaminents;
        var microbialSafety = r.stamps[i].microbialSafety; 
        
        var physicalQuality = r.stamps[i].physicalQuality;
        var temperatureControl= r.stamps[i].temperatureControl;
        
        var stepLabel = 1+i;

        $('.steps').append('<hr><div class = row><div class = "col-md-4"><h4>'+stepLabel+'</h4><h5>'
         + locationName +'</h5><h5>' + facilityName + '</h5></h5></div><div class = "col-md-4"><h4>Microbial Safety</h4><h5>' + microbialSafety + 
         '</h5><h4>Chemicals</h4><h5>'+ chemicalContaminents + '</h5></div><div class = "col-md-4"><h4>Physical Quality </h4><h5>' + physicalQuality + '</h5><h4>Temperature Control</h4><h5>' + temperatureControl +
         '</h4></div>');

	 }

	 $('.results').fadeIn();

}

function buildChart(){


var data =[];

var indexOfId = function(arr, id, index) {
    if (!index) { index = 0; }
    if (arr[index].itemId == id) {
      return index;
    }
    return ((index += 1) >= arr.length) ? -1 : indexOfId(arr, id, index);
};

getFoodItem = function( itemId ){
  requestSettings = {
  "async": true,
  "crossDomain": true,
  "url": "http://govhacksapi.herokuapp.com/scan/all/" + itemId ,
  "method": "GET",
}

$.ajax(requestSettings).done(function (response) {
  var foodItems = response;




  function getChildren(index){

      var foodNode = {
          "name":foodItems[index].name,
          "children": []
        }
        var children = [];

      if (foodItems[index].links.length > 0){
      
      for(var i = 0; i < foodItems[index].links.length; i++){
        var idx = (indexOfId(foodItems,foodItems[index].links[i]));

        children.push({
          "name": foodItems[idx].name,
          "children": getChildren(idx)
        });
      }
      
      foodNode.children=children;
      
  }
  return children;

  }

   var foodNode = {
          "name":foodItems[0].name,
          "children": getChildren(0)
        }


  data.push( foodNode);

  
  root = data[0];
  
  drawGraph(root);
});
}

getFoodItem( $('#foodItemId').val() );


var margin = {top: 0, right: 120, bottom: 0, left: 120},
 width = 960 - margin.right - margin.left,
 height = 1060 - margin.top - margin.bottom;
 

var svg = d3.select("svg").attr("width", width + margin.right + margin.left)
 .attr("height", height + margin.top + margin.bottom)
  .append("g")
 .attr("transform", "translate(" + margin.left + "," + margin.top + ")"); 
    
var i = 0;

var tree = d3.layout.tree()
 .size([height, width]);

var diagonal = d3.svg.diagonal()
 .projection(function(d) { return [d.y, d.x]; });



function drawGraph(source) {

  var nodes = tree.nodes(root).reverse(),
   links = tree.links(nodes);

  nodes.forEach(function(d) { d.y = d.depth * 180; });

  var node = svg.selectAll("g.node")
   .data(nodes, function(d) { return d.id || (d.id = ++i); });

  var nodeEnter = node.enter().append("g")
   .attr("class", "node")
   .attr("transform", function(d) { 
    return "translate(" + d.y + "," + d.x + ")"; });

  nodeEnter.append("circle")
   .attr("r", 8)
   .style("fill", "#fff");

  nodeEnter.append("text")
   .attr("x", function(d) { 
    return d.children || d._children ? -13 : 13; })
   .attr("dy", "10px")
   .attr("text-anchor", function(d) { 
    return d.children || d._children ? "end" : "start"; })
   .text(function(d) { return d.name; })
   .style("fill-opacity", 1);

  var link = svg.selectAll("path.link")
   .data(links, function(d) { return d.target.id; });

  link.enter().insert("path", "g")
   .attr("class", "link")
   .attr("d", diagonal);

}

}