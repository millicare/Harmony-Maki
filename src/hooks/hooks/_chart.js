import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

let chart = null;

export const drawLineChart = (id, data) => {
    am4core.useTheme(am4themes_animated);
    chart = am4core.create(id, am4charts.XYChart);
    chart.data = data;

    // Create axes
    let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.minGridDistance = 100;
    dateAxis.renderer.grid.template.disabled = true;

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.inside = true;
    valueAxis.renderer.grid.template.disabled = true;

    // Create series
    let series = chart.series.push(new am4charts.LineSeries());
    series.dataFields.valueY = "1";
    series.dataFields.dateX = "0";
    series.strokeWidth = 2;
    series.minBulletDistance = 50;
    series.tooltipText = "${valueY} USD";
    series.tooltip.pointerOrientation = "vertical";
    series.tooltip.background.cornerRadius = 4;
    series.tooltip.background.fillOpacity = 0.5;
    series.tooltip.label.padding(8, 8, 8, 8);

    // Add cursor
    chart.cursor = new am4charts.XYCursor();
    chart.cursor.xAxis = dateAxis;
    chart.cursor.snapToSeries = series;
};

export const disposeChart = () => {
    if (chart) chart.dispose();
};
