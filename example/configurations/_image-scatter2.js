import chart from 'rawcharts/bubblechart'
import data from '../datasets/photos-twitter.tsv'

export default {
  chart: chart,
  data,
  dataTypes: {
    Likes: 'number',
    Comments: 'number',
    Photo: 'string',
    Category: 'string',
  },
  mapping: {
    x: { value: ['Likes'] },
    y: { value: ['Comments'] },
    image: { value: ['Photo'] },
    size: { value: ['Comments'] },
    color: { value: ['Category'] },
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
