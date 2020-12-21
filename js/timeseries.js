var time_series_national_data = null;
var time_series_municipality_data = null;
var time_series_hospitalization_data = null;

// Load all data
$.get("json/municipalities_time_series.json", function(data) {
  time_series_municipality_data = data;
  update_time_series_plot();
});

$.get("json/national_time_series.json", function(data) {
  time_series_national_data = data;
  update_time_series_plot();
});

$.get("json/hospitalization_time_series.json", function(data) {
  time_series_hospitalization_data = data;
  update_time_series_plot();
});

// Define various mapping and filter functions
function compute_tests_positive_percent(cases, tested_persons) {
  percent_positive = [];
  for (var i = 0; i < cases.length; ++i) {
    if (tested_persons[i] == 0)
      percent_positive.push(0);
    else
      percent_positive.push(100 * (cases[i]/tested_persons[i]));
  }

  return percent_positive;
}

// Functions for displaying plots
function update_time_series_plot() {
  if (time_series_national_data == null)
    return;
  if (time_series_municipality_data == null)
    return;
  if (time_series_hospitalization_data == null)
    return;

  const plot_select_element  = $('#time-series-plot-container .plot-select option:selected');
  const plot_type = plot_select_element.attr('class');

  $('.data-unavailable-warning').hide();
  $('#time-series-plot').show();

  var x = null;
  var y = null;
  var source = null;
  var source_url = null;
  var last_updated = null;
  var title = plot_select_element.text();

  if (plot_type == 'option-deaths') {
    x = time_series_national_data['dates'];
    source = time_series_national_data['source'];
    source_url = time_series_national_data['source_url'];
    last_updated = time_series_national_data['last_updated'];
    y = time_series_national_data['deaths'];
  }
  else if (plot_type == 'option-hospitalized' || plot_type == 'option-intensive-care' || plot_type == 'option-respirator') {
    x = time_series_hospitalization_data['dates'];
    source = time_series_hospitalization_data['source'];
    source_url = time_series_hospitalization_data['source_url'];
    last_updated = time_series_hospitalization_data['last_updated'];

    if (plot_type == 'option-hospitalized')
      y = time_series_hospitalization_data['hospitalized'];
    else if (plot_type == 'option-intensive-care')
      y = time_series_hospitalization_data['intensive_care'];
    else if (plot_type == 'option-respirator')
      y = time_series_hospitalization_data['respirator'];
  }
  else {
    const region = $('#time-series-plot-container .region-select option:selected').text()
    // Load data based on region
    var region_data = null;
    if (region == 'Danmark') {
      x = time_series_national_data['dates'];
      source = time_series_national_data['source'];
      source_url = time_series_national_data['source_url'];
      last_updated = time_series_national_data['last_updated'];
      region_data = time_series_national_data;
    }
    else {
      x = time_series_municipality_data['dates'];
      source = time_series_municipality_data['source'];
      source_url = time_series_municipality_data['source_url'];
      last_updated = time_series_municipality_data['last_updated'];
      region_data = time_series_municipality_data['municipalities'][region];
    }

    if (plot_type == 'option-cases') {
      y = region_data['cases'];
    }
    else if (plot_type == 'option-tests-total') {
      y = region_data['testedPersons'];
    }
    else { // percentage
      x = x.slice(100);
      y = compute_tests_positive_percent(region_data['cases'], region_data['testedPersons']).slice(100);
    }
  }

  var trace1 = {
    x: x.slice(0, -2),
    y: y.slice(0, -2),
    type: 'scatter',
    mode: 'lines+markers',
    name: 'Cases',
    yaxis: 'y',
  };

  var data = [trace1];

  var selectorOptions = {
    buttons: [
      {
        // step: 'week',
        // count: 1,
        // label: '1w',
        // stepmode: 'backward',
      // }, {
        step: 'month',
        count: 1,
        label: '1m',
        stepmode: 'backward',
      }, {
        step: 'month',
        count: 2,
        label: '2m',
        stepmode: 'backward',
      }, {
        step: 'all',
      }],
  };

  var layout = {
    xaxis: {
      rangeslider: {},
      rangeselector: selectorOptions,
      type: "date",
      title: "Dato"
    },
    yaxis: {
      title: title,
    },
    title: "Tidsserie",
  };

  $('#time-series-plot-container .spinner').hide();
  Plotly.newPlot('time-series-plot', data, layout, {displayModeBar: false, responsive: true});

  moment.locale('da')
  $("#time-series-plot-container .source-link").text(source).attr("href", source_url);
  const last_updated_text = moment(last_updated, "YYYY-MM-DD HH:mm:ss").format('D. MMM, HH:mm');
  $("#time-series-plot-container .source-updated-text").text(last_updated_text);
}

var region_select_mode = 'ALL'

function update_region_select() {
  const plot_type = $('#time-series-plot-container .plot-select option:selected').attr('class');
  const enabled = (plot_type == 'option-cases' || plot_type == 'option-tests-positive' || plot_type == 'option-tests-total');
  $('#time-series-plot-container .region-select').prop('disabled', !enabled);
}

$('#time-series-plot-container .plot-select').change(function() {
  update_region_select();
  update_time_series_plot();
});

$('#time-series-plot-container .region-select').change(function() {
  update_time_series_plot();
});

$(function() {
  update_region_select();
});
