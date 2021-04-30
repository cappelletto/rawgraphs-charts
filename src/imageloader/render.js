import * as d3 from 'd3'
import { legend } from '@rawgraphs/rawgraphs-core'
import '../d3-styles.js'
import 'regenerator-runtime/runtime'

export function render(
  node,
  data,
  visualOptions,
  mapping,
  originalData,
  styles
) {
  // destructurate visual visualOptions
  const {
    // default options
    width,
    height,
    background,
    dotsRadius,
    colorScale,
    // add below other options defined in visualOptions.js
  } = visualOptions
  console.log(data)
  // select the SVG element
  const div = d3.select(node)
  //load all the images

  const imgs = Promise.all(data.map((row) => getBase64FromUrl(row.image))).then(
    (values) => {
      console.log(values)
    }
  )

  console.log('imgs', imgs)
}

const getBase64FromUrl = async (url) => {
  const data = await fetch(url)
  const blob = await data.blob()
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.readAsDataURL(blob)
    reader.onloadend = () => {
      const base64data = reader.result
      resolve(base64data)
    }
  })
}
