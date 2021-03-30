import chart from 'rawcharts/bubblechart'
import data from '../datasets/photos-twitter.tsv'

export default {
  chart: chart,
  data,
  dataTypes: {
    Likes: 'number',
    Comments: 'number',
    Photo: 'string',
  },
  mapping: {
    x: { value: ['Likes'] },
    y: { value: ['Comments'] },
    image: { value: ['Photo'] },
    size: { value: ['Comments'] },
  },
  visualOptions: {
    width: 500,
    height: 500,
    xOrigin: false,
    showLegend: true,
  },
}
