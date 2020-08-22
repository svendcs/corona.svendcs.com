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

    mappedDates.push(dates[i]);
    mappedConfirmed.push(newConfirmed);
    mappedTested.push(newTested);
    mappedConfirmedPercent.push(newConfirmedPercent);

    lastDate = date;
  }

  return [mappedDates, mappedConfirmed, mappedTested, mappedConfirmedPercent];
}

$.get("json/config.json", function(configData) {
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
      buttons: [
        {
          step: 'week',
          count: 1,
          label: '1w',
          stepmode: 'backward',
        }, {
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

    $('#spinner').hide();
    Plotly.newPlot('time-series', data, layout, {staticPlot: false});
  });
});

