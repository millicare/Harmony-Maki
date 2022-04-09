"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.disposeChart = exports.drawLineChart = void 0;

var am4core = _interopRequireWildcard(require("@amcharts/amcharts4/core"));

var am4charts = _interopRequireWildcard(require("@amcharts/amcharts4/charts"));

var _animated = _interopRequireDefault(require("@amcharts/amcharts4/themes/animated"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var chart = null;

var drawLineChart = function drawLineChart(id, data) {
  am4core.useTheme(_animated["default"]);
  chart = am4core.create(id, am4charts.XYChart);
  chart.data = data; // Create axes

  var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
  dateAxis.renderer.minGridDistance = 100;
  dateAxis.renderer.grid.template.disabled = true;
  var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
  valueAxis.renderer.inside = true;
  valueAxis.renderer.grid.template.disabled = true; // Create series

  var series = chart.series.push(new am4charts.LineSeries());
  series.dataFields.valueY = "1";
  series.dataFields.dateX = "0";
  series.strokeWidth = 2;
  series.minBulletDistance = 50;
  series.tooltipText = "${valueY} USD";
  series.tooltip.pointerOrientation = "vertical";
  series.tooltip.background.cornerRadius = 4;
  series.tooltip.background.fillOpacity = 0.5;
  series.tooltip.label.padding(8, 8, 8, 8); // Add cursor

  chart.cursor = new am4charts.XYCursor();
  chart.cursor.xAxis = dateAxis;
  chart.cursor.snapToSeries = series;
};

exports.drawLineChart = drawLineChart;

var disposeChart = function disposeChart() {
  if (chart) chart.dispose();
};

exports.disposeChart = disposeChart;