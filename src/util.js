import * as R from 'ramda';
import { formatPrefix, format } from 'd3-format'

const roundtenth = (n) => Math.round(n*10)/10
const roundhundth = (n) => Math.round(n*100)/100
const roundthousth = (n) => Math.round(n*1000)/1000

const pickformatter = (data) => {
  let max = Math.abs(R.reduce(R.max, 0, R.values(data)))
  let formatter 
  if(max >= 10000){
   formatter = formatPrefix('.0',1e3)
  }else if(max >= 1000){
   formatter = format('.3s')
  }else{
   formatter = format('.3~r')
  }
  return formatter
}



export { roundtenth, roundhundth, roundthousth, pickformatter}
