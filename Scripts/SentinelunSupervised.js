/*
Author: Samet Aksoy
Mail: aksoysa@itu.edu.tr
*/
var center_lon = 30.350902;
var center_lat = 36.373952;
var roi = ee.Geometry.Polygon([[center_lon-0.05, center_lat-0.07], [center_lon+0.13, center_lat-0.07], [center_lon+0.13, center_lat+0.07], [center_lon-0.05, center_lat+0.07]]);
Map.setCenter(center_lon,center_lat, 12);

var input = GetImage('COPERNICUS/S2', '2016-07-11', '2016-07-12', roi);

var training = input.sample({
  region: roi,
  scale: 30,
  numPixels: 5000
});

var clusterer = ee.Clusterer.wekaKMeans(5).train(training);

var result = input.cluster(clusterer);
var Palette = [
  'FFFFFF',
  'FFFFFF',
  'FFFFFF',
  'FFFFFF',
  'FF0000',
];
// Display the clusters with random colors.
//Map.addLayer(result.randomVisualizer(), {}, 'clusters');
Map.addLayer(result, {min: 0, max: 4, palette: Palette}, 'clusters');

//Map.addLayer(a_f, {min:0,max:3000, bands:['B4','B3','B2']}, 'RGB');


/*Export.image.toDrive({
  image: mosaic,
  description: 'SentinelDNBR',
  scale: 10
});*/
function GetImage(collect, date1, date2, clp) {
  return ee.ImageCollection(collect).filterDate(date1, date2).mosaic().clip(clp);
}
