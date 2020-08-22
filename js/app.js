$.get("config.json", function(configData) {
  $.get("json/municipalities/aarhus.json", function(municipalityData) {
    var dates = configData['dates'];
    var cases = municipalityData['cases'];
    var tested = municipalityData['tested'];
    var newDates = [];
    var newCases = [];
    var newTested = [];
    var newConfirmPercent = [];

    var first = true;
    for (var i = 1; i < cases.length; ++i) {
      newCases.push(cases[i] - cases[i-1]);
      newTested.push(tested[i] - tested[i-1]);
      newDates.push(dates[i]);
      newConfirmPercent.push(100*(cases[i] - cases[i-1])/(tested[i] - tested[i-1]));
    }

    var trace = {
      x: newDates,
      y: newCases,
      type: 'scatter',
      mode: 'lines+markers',
    };

    var data = [trace];
    var layout = {};

    Plotly.newPlot('tester', data, layout, {staticPlot: false});
  });
});

