function mapMunicipalityData(dates, cumConfirmed, cumTested) {
  var mappedDates = [];
  var mappedConfirmed = [];
  var mappedTested = [];
  var mappedConfirmedPercent = [];

  var lastDate = moment(dates[0], 'YYYY-MM-DD');
  for (var i = 1; i < dates.length; ++i) {
    const date = moment(dates[i], 'YYYY-MM-DD');
    const dayDiff = date.diff(lastDate, 'days')
    const newConfirmed = (cumConfirmed[i] - cumConfirmed[i-1])/dayDiff;
    const newTested = (cumTested[i] - cumTested[i-1])/dayDiff;
    const newConfirmedPercent = 100 * (newConfirmed/newTested);

    console.log(dates[i], newConfirmed);

    mappedDates.push(dates[i]);
    mappedConfirmed.push(newConfirmed);
    mappedTested.push(newTested);
    mappedConfirmedPercent.push(newConfirmedPercent);

    lastDate = date;
  }

  return [mappedDates, mappedConfirmed, mappedTested, mappedConfirmedPercent];
}

$.get("config.json", function(configData) {
  $.get("json/municipalities/aarhus.json", function(municipalityData) {
    const [dates, newConfirmed, newTested, newConfirmedPercent] = mapMunicipalityData(configData['dates'], municipalityData['cases'], municipalityData['tested']);

    var trace = {
      x: dates,
      y: newConfirmed,
      type: 'scatter',
      mode: 'lines+markers',
    };

    var data = [trace];

    var selectorOptions = {
      buttons: [{
        step: 'week',
        stepmode: 'backward',
        count: 1,
        label: '1w'
      }, {
        step: 'month',
        stepmode: 'backward',
        count: 1,
        label: '1m'
      }, {
        step: 'month',
        stepmode: 'backward',
        count: 2,
        label: '2m'
      }, {
        step: 'all',
      }],
    };

    var layout = {
      title: 'Aarhus Corona Data',
      xaxis: {
        rangeselector: selectorOptions,
        rangeslider: {},
      },
      yaxis: {
        fixedrange: true,
      },
    };

    Plotly.newPlot('tester', data, layout, {staticPlot: false});
  });
});

