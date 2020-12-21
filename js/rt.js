var rt_national_data = null;

// Load all data
$.get("json/rt.json", function(data) {
  rt_national_data = data;
  update_rt_plot();
});

// Define various mapping and filter functions
function map_bounds(estimate, lower, upper) {
  var mapped_lower = []
  var mapped_upper = []

  for (var i = 0; i < estimate.length; ++i) {
    mapped_lower.push(estimate[i] - lower[i]);
    mapped_upper.push(upper[i] - estimate[i]);
  }

  return [mapped_lower, mapped_upper]
}

function update_rt_plot() {
  if (rt_national_data == null)
    return;

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
}

