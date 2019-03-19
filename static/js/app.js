// Populated Metadata Panel with data for each selected sample
function buildMetadata(sample) {

    var selector = d3.select("#sample-metadata");

    selector.html("");
    var url_meta = `/metadata/${sample}`

    d3.json(url_meta).then(function(data) {

      Object.entries(data).forEach(function([key, value]) {
        var cell = selector.append("div");
        var key_format = key.toUpperCase();
        cell.text(`${key_format}: ${value}`);
      
    });

    });
}

// Processes data from the samples endpoint and constructs the pie and bubble charts with the data.
function buildCharts(sample) {

  var url_sample = `/samples/${sample}`
  
  d3.json(url_sample).then(function(data) {
    
      var otu_id_viz = data.map(function(test) {
        return test.otu_id;
      });

      var otu_label_viz = data.map(function(test) {
        return test.otu_label;
      });

      var sample_values_viz = data.map(function(test) {
        return test.sample_values;
      });

    // BUBBLE CHART *****************************************************

    var bub_trace = {
      x: otu_id_viz,
      y: sample_values_viz,
      text: otu_label_viz,
      mode: 'markers',
      marker: {
        size: sample_values_viz,
        color: otu_id_viz
      }
    };
    
    var bub_data = [bub_trace];
    
    var bub_layout = {
      showlegend: false,
      xaxis: {
        title: {
          text: 'OTU ID'
        }
      }
    };
    
    Plotly.newPlot('bubble', bub_data, bub_layout);


    // PIE CHART *****************************************************

    var data_sort = data.sort(function compareFunction(a, b) {

     return b.sample_values - a.sample_values;
   });

   const left = data_sort.slice(0, 10);
   console.log(left);

  var otu_id_pie = left.map(function(test) {
    return test.otu_id;
  });
  console.log(otu_id_pie)

  var otu_label_pie = left.map(function(test) {
    return test.otu_label;
  });
  console.log(otu_label_pie)

  var sample_values_pie = left.map(function(test) {
    return test.sample_values;
  });
  console.log(sample_values_pie)

  var pie_data = [{
    values: sample_values_pie,
    labels: otu_id_pie,
    type: 'pie',
    text: otu_label_pie,
    hoverinfo: 'text+value'

  }];
  
  var pie_layout = {
    height: 500,
    width: 700
  };
  
  Plotly.newPlot('pie', pie_data, pie_layout);

    })
}

// Initializes the application.
function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
