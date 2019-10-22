import React from 'react'
import * as R from 'ramda';
import fps from '@jadesrochers/fpstreamline';

const passprops = (pass, children) => {
  if( ! children ){ return undefined }
  const propsToChildren = R.map(child => {
    return React.cloneElement(child, 
     {...pass })
  })(fps.toArray(children))
  return propsToChildren
}

const passAllProps = (props) => {
  const propsToChildren =  passprops(props, props.children)
  return propsToChildren  
}

const passExceptChildren = (props) => {
  const pass = R.dissoc('children',props)
  const propsToChildren =  passprops(pass, props.children)
  return propsToChildren  
}

const passGivenProps = (propstopass, children) => {
  const propsToChildren =  passprops(propstopass, children)
  return propsToChildren  
}


export { passAllProps, passExceptChildren, passGivenProps }
