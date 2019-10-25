import * as R from 'ramda';
// Purpose of these functions is to allow a map/figure with changable data  
// To save the current, highlight it, and unhighlight without needing to  
// know what the original was

const shareStyling = (...infn) => {
  let original = {}
  let outfn = R.map(R.flip(R.partial)([original]))(infn) 
  return outfn 
}

const highlightStyling = R.curry(function(original,changes,current){
   let active = current.target;
   original.saved = R.pickAll(R.keys(changes), active.style)
   R.map(style => active.style[style[0]]=style[1])(R.toPairs(changes))
})

const deHighlightStyling = R.curry(function(original,current){
   let active = current.target;
   R.map(style => active.style[style[0]]=style[1])(R.toPairs(original.saved))
 })

// The 'original' arg is passed by shareStyling so the fcns can read/write
// to it
const [highlight, deHighlight] = shareStyling(highlightStyling, deHighlightStyling)

export { highlight, deHighlight }

