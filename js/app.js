$.get("json/municipalities.json", function(data) {
  const cases = data['municipalities']['Aarhus']['cases'];
  const tested_persons = data['municipalities']['Aarhus']['testedPersons'];
  const dates = data['dates'];

  percent_positive = [];
  for (var i = 0; i < cases.length; ++i) {
    if (tested_persons[i] == 0) {
      percent_positive.push(0);
      continue;
    }

    percent_positive.push(100 * (cases[i]/tested_persons[i]));
  }

  var trace1 = {
    x: dates.slice(0, dates.length - 2),
    y: cases.slice(0, dates.length - 2),
    type: 'scatter',
    mode: 'lines+markers',
    name: 'Tested Persons',
  };

  var trace2 = {
    x: dates.slice(0, dates.length - 2),
    y: percent_positive.slice(0, dates.length - 2),
    type: 'scatter',
    mode: 'lines+markers',
    name: 'Positive Tests (%)',
    yaxis: 'y2',
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
      rangeslider: {range: ['2020-07-19', '2020-08-19']},
      rangeselector: selectorOptions,
      type: "date",
    },
    yaxis: {
      title: "count",
    },
    yaxis2: {
      title: "percent",
      overlaying: 'y',
      side: 'right',
      range: [0, 1],
    },
  };

  $('#scatter-plot-container .spinner').hide();
  Plotly.newPlot('scatter-plot', data, layout, {staticPlot: false});
});

function mapBounds(estimate, lower, upper) {
  var mappedLower = []
  var mappedUpper = []

  for (var i = 0; i < estimate.length; ++i) {
    mappedLower.push(estimate[i] - lower[i]);
    mappedUpper.push(upper[i] - estimate[i]);
  }

  return [mappedLower, mappedUpper]
}

$.get("json/rt.json", function(data) {
  const dates = data['cases']['dates']
  const estimate = data['cases']['estimate']
  const [lower, upper] = mapBounds(estimate, data['cases']['lower'], data['cases']['upper']);

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
  };

  $('#rt-plot .spinner').hide();
  Plotly.newPlot('rt-plot', data, layout, {staticPlot: false});
});
