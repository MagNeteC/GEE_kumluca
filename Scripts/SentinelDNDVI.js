var center_lon = 30.350902;
var center_lat = 36.373952;
var roi = ee.Geometry.Polygon([[center_lon-0.05, center_lat-0.07], [center_lon+0.13, center_lat-0.07], [center_lon+0.13, center_lat+0.07], [center_lon-0.05, center_lat+0.07]]);
Map.setCenter(center_lon,center_lat, 12);

var b_f = GetImage('COPERNICUS/S2', '2016-06-21', '2016-06-22', roi);
var a_f = GetImage('COPERNICUS/S2', '2016-07-11', '2016-07-12', roi);

var ndvi_a_f = a_f.normalizedDifference(['B8', 'B4']);
var ndvi_b_f = b_f.normalizedDifference(['B8', 'B4']);
/*
var ndvi_a_f = a_f.expression("(NIR - RED)/(NIR + RED)",
                            {
                              NIR:a_f.select('B8'),
                              RED:a_f.select('B4')
                            });
var ndvi_b_f = b_f.expression("(NIR - RED)/(NIR + RED)",
                            {
                              NIR:b_f.select('B8'),
                              RED:b_f.select('B4')
                            });*/

var dndvi = ndvi_b_f.subtract(ndvi_a_f);


var dndvi_masked = dndvi.updateMask(dndvi.gte(0.1));
var ndvipo = dndvi_masked.visualize({
  min: 0.1,
  max: 1,
  palette: ['DDDDFF', 'FF0000']
});

var ndvip = dndvi.visualize({
  min: -1,
  max: 0.1,
  palette: ['0000FF', 'AAAAFF']
});

var mosaic = ee.ImageCollection([ndvip, ndvipo]).mosaic();
Map.addLayer(mosaic, {}, 'DNDVI');

function GetImage(collect, date1, date2, clp) {
  return ee.ImageCollection(collect).filterDate(date1, date2).mosaic().clip(clp);
  
}