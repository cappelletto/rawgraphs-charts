import scatterplot from "rawcharts/scatterplot"
import data from "../datasets/Titanic.tsv"

export default {
  chart: scatterplot,
  data,
  dataTypes: {
    Age: "number",
    Fare: "number",
  },
  mapping: {
    x: { value: ["Age"] },
    y: { value: ["Fare"] },
    color: { value: ["Age"] },
    label: { value: ["Fare"] },
    size: { value: ["Age"] },
  },
  visualOptions: {
    width: 500,
    height: 500,
    xOrigin: false,
  },
}
