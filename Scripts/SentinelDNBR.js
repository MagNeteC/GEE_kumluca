/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var imageVisParam = {"opacity":1,"bands":["nd"],"min":-1,"max":1,"gamma":1.0190000000000001};
/***** End of imports. If edited, may not auto-convert in the playground. *****/
var center_lon = 30.350902;
var center_lat = 36.373952;
var roi = ee.Geometry.Polygon([[center_lon-0.05, center_lat-0.07], [center_lon+0.13, center_lat-0.07], [center_lon+0.13, center_lat+0.07], [center_lon-0.05, center_lat+0.07]]);
Map.setCenter(center_lon,center_lat, 12);

var b_f = GetImage('COPERNICUS/S2', '2016-06-21', '2016-06-22', roi);
var a_f = GetImage('COPERNICUS/S2', '2016-07-11', '2016-07-12', roi);

var nbr_a_f = a_f.normalizedDifference(['B8A', 'B12']);
var nbr_b_f = b_f.normalizedDifference(['B8A', 'B12']);

/*
var nbr_a_f = a_f.expression("(NIR - SWIR)/(NIR + SWIR)",
                            {
                              NIR:a_f.select('B8A'),
                              SWIR:a_f.select('B12')
                            });
var nbr_b_f = b_f.expression("(NIR - SWIR)/(NIR + SWIR)",
                            {
                              NIR:b_f.select('B8A'),
                              SWIR:b_f.select('B12')
                            });*/
var dnbr = nbr_b_f.subtract(nbr_a_f);

var dnbr_masked = dnbr.updateMask(dnbr.gte(0.1));
var nbrpo = dnbr_masked.visualize({
  min: 0.1,
  max: 1,
  palette: ['DDDDFF', 'FF0000']
});

var nbrp = dnbr.visualize({
  min: -1,
  max: 0.1,
  palette: ['0000FF', 'AAAAFF']
});

var mosaic = ee.ImageCollection([nbrp, nbrpo]).mosaic();
Map.addLayer(mosaic, {}, 'DNBR');

/*Export.image.toDrive({
  image: mosaic,
  description: 'SentinelDNBR',
  scale: 10
});*/
function GetImage(collect, date1, date2, clp) {
  return ee.ImageCollection(collect).filterDate(date1, date2).mosaic().clip(clp);
  
}