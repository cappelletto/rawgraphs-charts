import chart from 'rawcharts/imageloader'
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
    image: { value: ['Photo'] },
  },
  visualOptions: {},
}
