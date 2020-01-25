var center_lon = 30.350902;
var center_lat = 36.373952;
var roi = ee.Geometry.Polygon([[center_lon-0.05, center_lat-0.07], [center_lon+0.13, center_lat-0.07], [center_lon+0.13, center_lat+0.07], [center_lon-0.05, center_lat+0.07]]);

var b_f = GetImage('LANDSAT/LC08/C01/T1', 178, 35, '2016-06-22', '2016-06-23', roi);
var a_f = GetImage('LANDSAT/LC08/C01/T1', 178, 35, '2016-07-24', '2016-07-25', roi);

var nbr_a_f = a_f.normalizedDifference(['B5', 'B7']);
var nbr_b_f = b_f.normalizedDifference(['B5', 'B7']);
/*
var nbr_a_f = a_f.expression("(NIR - SWIR)/(NIR + SWIR)",
                            {
                              NIR:a_f.select('B5'),
                              SWIR:a_f.select('B7')
                            });
var nbr_b_f = b_f.expression("(NIR - SWIR)/(NIR + SWIR)",
                            {
                              NIR:b_f.select('B5'),
                              SWIR:b_f.select('B7')
                            });*/
var dnbr = nbr_b_f.subtract(nbr_a_f);

Map.setCenter(center_lon,center_lat, 12);
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
Map.addLayer(mosaic, {}, 'mosaic');
/*Export.image.toDrive({
  image: mosaic,
  description: 'LandsatDNBR',
  scale: 10
});*/
function GetImage(collect, path, row, date1, date2, clp) {
  return ee.ImageCollection(collect)
        .filter(ee.Filter.eq('WRS_PATH', path))
        .filter(ee.Filter.eq('WRS_ROW', row))
        .filterDate(date1, date2)
        .mosaic()
        .clip(clp);
}