var center_lon = 30.350902;
var center_lat = 36.373952;
var roi = ee.Geometry.Polygon([[center_lon-0.05, center_lat-0.07], [center_lon+0.13, center_lat-0.07], [center_lon+0.13, center_lat+0.07], [center_lon-0.05, center_lat+0.07]]);

var b_f = GetImage('LANDSAT/LC08/C01/T1', 178, 35, '2016-06-22', '2016-06-23', roi);
var a_f = GetImage('LANDSAT/LC08/C01/T1', 178, 35, '2016-07-24', '2016-07-25', roi);

var ndvia_a_f = a_f.normalizedDifference(['B5', 'B4']);
var ndvia_b_f = b_f.normalizedDifference(['B5', 'B4']);
/*
var ndvia_a_f = a_f.expression("(NIR - RED)/(NIR + RED)",
                            {
                              NIR:a_f.select('B5'),
                              RED:a_f.select('B4')
                            });
var ndvia_b_f = b_f.expression("(NIR - RED)/(NIR + RED)",
                            {
                              NIR:b_f.select('B5'),
                              RED:b_f.select('B4')
                            });*/

var dndvia = ndvia_b_f.subtract(ndvia_a_f);
//Map.addLayer(dndvia, {}, '');
Map.setCenter(center_lon,center_lat, 12);
var dndvi_masked = dndvia.updateMask(dndvia.gte(0.1));
var ndvipo = dndvi_masked.visualize({
  min: 0.1,
  max: 1,
  palette: ['DDDDFF', 'FF0000']
});

var ndvip = dndvia.visualize({
  min: -1,
  max: 0.1,
  palette: ['0000FF', 'AAAAFF']
});

var mosaic = ee.ImageCollection([ndvip, ndvipo]).mosaic();
Map.addLayer(mosaic, {}, 'mosaic');

function GetImage(collect, path, row, date1, date2, clp){return ee.ImageCollection(collect).filter(ee.Filter.eq('WRS_PATH', path)).filter(ee.Filter.eq('WRS_ROW', row)).filterDate(date1, date2).mosaic().clip(clp);}