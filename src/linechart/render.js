import * as d3 from "d3";
import * as d3Array from 'd3-array'
// import { categoryLegend } from 'rawgraphs-core'

export function render(svgNode, data, visualOptions, mapping, originalData) {

  console.log("linechart data",data)

  const {
    // artboard options
    width,
    height,
    background,
    marginTop,
    marginRight,
    marginBottom,
    marginLeft,
    // chart options
    interpolation,
    showPoints,
    pointsRadius,
    strokeWidth,
    // series options
    columnsNumber,
    useSameScale = false, // TODO: add
    sortSeriesBy,
    gutter,
    showSeriesLabels,
    repeatAxesLabels,
    // labels options
    showLabels,
    labelsPosition,
    labelsShorten,
    labelsChars,
		colorScale
    //TODO add labels legends and colors
  } = visualOptions;

  const margin = {
    top: marginTop,
    right: marginRight,
    bottom: marginBottom,
    left: marginLeft,
  };

  //
  d3.select(svgNode).append('style')
  .text(`
    svg {
      font-family: Helvetica, Arial, sans-serif;
      font-size: 12px;
    }

    .title {
      font-weight: bold;
      fill: black;
      text-anchor: start;
      transform: translate(0px, -18px)
    }

    .tick > text {
      fill: #4d4d4d;
    }

    #axes path, #axes line {
      stroke:#161616
    }

    .axisTitle {
      fill: #161616;
      font-weight: bold;
      font-size: 12px;
    }

    .yAxis .axisTitle {
      text-anchor: start;
      font-size: 8px;
      transform: translate(14px, 0px)
    }

    .xAxis .axisTitle {
      text-anchor: end;
    }

    .labels {
      fill: #161616;
    }

    `);

  // create nest structure
  const nestedData = d3.nest()
    .key(d => d.series)
    .key(d => d.lines)
    .rollup(v => v.sort((a,b) => d3.ascending(a.x, b.x)))
    .entries(data);

  const verticalGutter = gutter + ((showSeriesLabels ? 12 : 0)) // if series labels are shown, increase gutter
  margin.top += showSeriesLabels ? 24 : 0;
  // compute the series grid according to amount of series and user optionss
  const rowsNumber = Math.ceil(nestedData.length/columnsNumber)

  const chartWidth = ((width - margin.left - margin.right) - (columnsNumber - 1) * gutter) / columnsNumber;
  const chartHeight = ((height - margin.top - margin.bottom) - (rowsNumber - 1) * verticalGutter) / rowsNumber;

  // create the grid
  let grid = nestedData.map(function(d,i){

    const xpos = i%columnsNumber;
    const ypos =  Math.floor(i/columnsNumber);

    return {
      x: xpos * (chartWidth + gutter),
      y: ypos * (chartHeight + verticalGutter),
      width: chartWidth,
      height: chartHeight
    }
  }) // grid OK


  // comupte max values for series
  // will add it as property to each series.

  nestedData.forEach(function(serie){
    serie.totalValue = data.filter(item => item.series == serie.key).reduce((result, item) => result + item.y, 0)
  })

  // sort the dataset according to sortSeriesBy option

  if(sortSeriesBy == "Total value (descending)"){
    nestedData.sort((a,b) => d3.descending(a.totalValue, b.totalValue))
  } else if(sortSeriesBy == "Total value (ascending)") {
    nestedData.sort((a,b) => d3.ascending(a.totalValue, b.totalValue))
  } else if(sortSeriesBy == "Name"){
    nestedData.sort((a,b) => d3.ascending(a.key, b.key))
  }

  // get domains
  const xDomain = d3.extent(data, d => d.x)
  const yDomain = d3.extent(data, d => d.y)
  // const colorDomain = d3.map(data, d => d.color).keys()

  // create the scales
  // const colorScale = d3.scaleOrdinal(d3.schemeCategory10).domain(colorDomain); //TODO: use RAWGraphs color scales


  let x;

  if(mapping.x.dataType === "number") {
    x = d3.scaleLinear().domain(xDomain).nice().range([0, chartWidth]);
  }

  if(typeof mapping.x.dataType === 'object' && mapping.x.dataType.type === "date") {
    x = d3.scaleTime().domain(xDomain).nice().range([0, chartWidth]);
  }

  const y = d3.scaleLinear().domain(yDomain).nice().range([chartHeight, 0]);

  const xAxis = (g) => {
    return g
      .attr("transform", `translate(0,${chartHeight})`)
      .call(d3.axisBottom(x).ticks(width / 80))
      .call((g) =>
        g.attr("class", "xAxis")
          .append("text")
          .attr("x", chartWidth)
          .attr("dy", -5)
          .attr('display',(d,i)=>{return i == 0 || repeatAxesLabels ? '' : 'none'}) // display according to options
          .attr("class","axisTitle")
          .text(mapping["x"].value)
      );
  };

  const yAxis = (g) => {
    return g
      .call(d3.axisLeft(y))
      .call((g) =>
        g.attr("class", "yAxis")
          .select(".tick:last-of-type text")
          .clone()
          .attr('display',(d,i)=>{return i == 0 || repeatAxesLabels ? '' : 'none'}) // display according to options
          .attr("class","axisTitle")
          .text(mapping["y"].value)
      );
  };

  // convert string to d3 functions
  const curveType = {
    "Basis": d3.curveBasis,
    "Bundle": d3.curveBundle,
    "Cardinal": d3.curveCardinal,
    "Catmull–Rom": d3.curveCatmullRom,
    "Linear": d3.curveLinear,
    "Monotone X": d3.curveMonotoneX,
    "Natural": d3.curveNatural,
    "Step": d3.curveStep,
    "Step After": d3.curveStepAfter,
    "Step Before": d3.curveStepBefore,
  };

  const line = d3
    .line()
    .x(function (d) {
      return x(d.x);
    })
    .y(function (d) {
      return y(d.y);
    })
    .curve(curveType[interpolation]);

  const svg = d3
    .select(svgNode)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .attr("id", "visualization")

  const vizLayer = svg
    .append("g")
    .selectAll("g")
    .data(nestedData)
    .join("g")
    .attr("id", d => d.key)
    .attr("transform", (d,i) => "translate(" + grid[i].x + "," + grid[i].y + ")") // translate each serie according to the grid object
    .attr("fill", "none")
    .attr("stroke-width", strokeWidth)
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round");

  // add the series title
  if(showSeriesLabels){
    vizLayer.append('text')
    .attr("x", -margin.left)
      .attr("class", "title")
      .text(d =>d.key)
  }

  const axisLayer = vizLayer.append("g").attr("id", "axes")
    axisLayer.append("g").call(xAxis);
    axisLayer.append("g").call(yAxis);

  const groups = vizLayer
    .append("g")
    .attr("id", "viz")
    .selectAll("g")
    .data(d => d.values) // pass the single line
    .join("g")
    .attr('id', d => d.key)

  groups
    .append("path")
    .attr("d", d => line(d.value)) // sorting values by the x axis
    .attr("stroke", d => colorScale(d.value[0].color))
    .attr("fill", "none");

  if (showPoints) {
    groups
      .append("g")
      .selectAll("circle")
      .data(d => d.value)
      .join("circle")
      .attr("class", "dot")
      .attr("cx", d => x(d.x))
      .attr("cy", d => y(d.y))
      .attr("r", pointsRadius)
      .attr("fill", d => colorScale(d.color))
  }

  if(showLabels){

    let labels = groups
      .append("text")
      .attr("class","labels")
      .text(d => labelsShorten ? d.key.slice(0, labelsChars) : d.key)

    if(labelsPosition == "side"){
      labels
        .attr("x", d => x(d.value.slice(-1)[0].x)) // get last x
        .attr("y", d => y(d.value.slice(-1)[0].y)) // get last x
        .attr("dx", 5)
        .attr("dy", 4)
        .attr("text-anchor", "start")

    } else if(labelsPosition == "inline"){
      labels
        .attr("x", d => {
          const maxPos = d3Array.greatest(d.value, e => e.y)
          return x(maxPos.x)
        })
        .attr("y", d => {
          const maxPos = d3Array.greatest(d.value, e=> e.y)
          return y(maxPos.y)
        })
        .attr("dx", 0)
        .attr("dy", -6)
        .attr("text-anchor", "middle")
    }
  }
}
