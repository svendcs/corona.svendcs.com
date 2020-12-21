var time_series_national_data = null;
var time_series_municipality_data = null;
var time_series_hospitalized_data = null;
var rt_national_data = null;

// Load all data
$.get("json/municipalities.json", function(data) {
  time_series_municipality_data = data;
  update_time_series_plot();
});

$.get("json/time_series.json", function(data) {
  time_series_national_data = data;
  update_time_series_plot();
});

$.get("json/hospitalized.json", function(data) {
  time_series_hospitalized_data = data;
  update_time_series_plot();
});

$.get("json/rt.json", function(data) {
  rt_national_data = data;
  update_rt_plot();
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

function map_bounds(estimate, lower, upper) {
  var mapped_lower = []
  var mapped_upper = []

  for (var i = 0; i < estimate.length; ++i) {
    mapped_lower.push(estimate[i] - lower[i]);
    mapped_upper.push(upper[i] - estimate[i]);
  }

  return [mapped_lower, mapped_upper]
}

// Functions for displaying plots
function update_time_series_plot() {
  if (time_series_national_data == null)
    return;
  if (time_series_municipality_data == null)
    return;
  if (time_series_hospitalized_data == null)
    return;

  $(function() {
    $('#time-series-plot-container .spinner').hide();

    const plot_type = $('#time-series-plot-container .plot-select option:selected').attr('class');
    const region = $('#time-series-plot-container .region-select option:selected').text()

    if (region != "Danmark" && plot_type != 'option-cases' && plot_type != 'option-tests-positive' && plot_type != 'option-tests-total') {
      $('.data-unavailable-warning').show();
      $('#time-series-plot').hide();
      return;
    }

    $('.data-unavailable-warning').hide();
    $('#time-series-plot').show();

    var x = null;
    var y = null;

    if (plot_type == 'option-cases' || plot_type == 'option-tests-total' || plot_type == 'option-deaths' || plot_type == 'option-tests-posive') {
      var region_data = null;
      if (region == 'Danmark') {
        x = time_series_national_data['dates'];
        region_data = time_series_national_data;
      }
      else {
        x = time_series_municipality_data['dates'];
        region_data = time_series_municipality_data['municipalities'][region];
      }

      if (plot_type == 'option-cases') {
        y = region_data['cases'];
      }
      else if (plot_type == 'option-tests-total') {
        y = region_data['testedPersons'];
      }
      else if (plot_type == 'option-deaths') {
        y = region_data['deaths']
      }
      else {
        x = x.slice(100);
        y = compute_tests_positive_percent(region_data['cases'], region_data['testedPersons']).slice(100);
      }
    }
    else { // hospitalized data
      console.log("Indlagte")
      x = time_series_hospitalized_data['dates']

      if (plot_type == 'option-hospitalized')
        y = time_series_hospitalized_data['hospitalized']
      else if (plot_type == 'option-intensive-care')
        y = time_series_hospitalized_data['intensive_care']
      else
        y = time_series_hospitalized_data['hospitalized']
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
        title: "test date"
      },
      yaxis: {
        title: "confirmed cases",
      },
      title: "Scatter Plot",
    };

    Plotly.newPlot('time-series-plot', data, layout, {displayModeBar: false, responsive: true});
  });
}

function update_rt_plot() {
  if (rt_national_data == null)
    return;

  $(function() {
    $('#rt-plot-container .spinner').hide();

    const dates = rt_national_data['dates'];
    const estimate = rt_national_data['estimate'];
    const [lower, upper] = map_bounds(estimate, rt_national_data['lower'], rt_national_data['upper']);

    var trace = {
      x: dates,
      y: estimate,
      error_y: {
        type: 'data',
        symmetric: false,
        array: upper,
        arrayminus: lower,
      },
      type: 'scatter',
      name: 'Rt estimated on cases',
    };

    var data = [trace];

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
      },
      yaxis: {
      },
      title: "Kontakttal",
    };

    $('#rt-plot .spinner').hide();
    Plotly.newPlot('rt-plot', data, layout, {displayModeBar: false, responsive: true});
  });
}

$(function() {
  $('#time-series-plot-container select').change(function() {
    update_time_series_plot();
  });

  $('#rt-plot-container select').change(function() {
    update_rt_plot();
  });
});

