/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var countries = ee.FeatureCollection("ft:1tdSwUL7MVpOauSgRzqVTOwdfy17KDbw-1d9omPw");
/***** End of imports. If edited, may not auto-convert in the playground. *****/

var Turkey = countries.filter(ee.Filter.eq('Country', 'Turkey'));
var dataset = ee.ImageCollection('MODIS/MYD09GA_006_NDVI')
                  .filter(ee.Filter.date('2018-06-01', '2018-08-01')).filterBounds(Turkey);
var colorized = dataset.select('NDVI').map(function(image){return image.clip(Turkey)});
var colorizedVis = {
  min: 0.0,
  max: 1.0,
  palette: [
    'FFFFFF', 'CE7E45', 'DF923D', 'F1B555', 'FCD163', '99B718', '74A901',
    '66A000', '529400', '3E8601', '207401', '056201', '004C00', '023B01',
    '012E01', '011D01', '011301'
  ],
};
Map.setCenter(34.696, 39.283, 6);
Map.addLayer(colorized, colorizedVis, 'Colorized');