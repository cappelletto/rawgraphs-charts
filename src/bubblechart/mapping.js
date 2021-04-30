import 'regenerator-runtime/runtime'

export const mapData = function (data, mapping, dataTypes, dimensions) {
  // load all images as base64
  Promise.all(
    data.map((row) => getBase64FromUrl(row[mapping.image.value]))
  ).then((values) => {
    //check results
    console.log(values)

    //return the data with base64 encoded iamges
    return data.map((d, i) => ({
      x: d[mapping.x.value],
      y: d[mapping.y.value],
      size: d[mapping.size.value],
      color: d[mapping.color.value],
      label: d[mapping.label.value],
      connectedBy: d[mapping.connectedBy.value],
      image: values[i],
    }))
  })
}

const getBase64FromUrl = async (url) => {
  const data = await fetch(url)
  const blob = await data.blob()
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.readAsDataURL(blob)
    reader.onloadend = () => {
      var image = new Image()
      image.src = reader.result
      const base64data = reader.result
      resolve(base64data)
    }
  })
}
