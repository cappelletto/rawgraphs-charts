import chart from 'rawcharts/bubblechart'
import data from '../datasets/mountains.tsv'

export default {
  chart: chart,
  data,
  //imageURL	prominence	wikidataURL	label	elevation
  dataTypes: {
    imageURL: 'string',
    prominence: 'number',
    wikidataURL: 'string',
    label: 'string',
    elevation: 'number',
  },
  mapping: {
    x: { value: ['prominence'] },
    y: { value: ['elevation'] },
    image: { value: ['imageURL'] },
    size: { value: ['elevation'] },
  },
  visualOptions: {
    width: 500,
    height: 500,
    xOrigin: false,
    showLegend: true,
    maxDiameter: 200,
    showPoints: true,
    strokeWidth: 3,
  },
}
