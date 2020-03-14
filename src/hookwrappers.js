import React, { useState } from 'react';
import * as R from 'ramda';
import * as fps from '@jadesrochers/fpstreamline'
import { passExceptChildren } from './passprops'


const HookWrapper = (props) => {
  let hook = props.hook ? props.hook() : undefined
  return(
    <div hook={hook} />
  )
}

// Only needed when a hook has no state updates to force update
const HookForceWrapper = (props) => {
  let hook = props.hook ? () => props.hook() : undefined
  const [x, setx] = useState(0)
  return(
    <HookWrapper hook={hook} forceupdate={setx} />
  )
}

const SvgWrapper = (props) => {
  const propsToChildren = passExceptChildren(props)
  return (
   <svg>
     { propsToChildren }
   </svg>
  )
}

const HooktoChildren = (props) => {
  let hook = props.hook ? props.hook() : undefined
  const propsToChildren = R.map(child => {
    return React.cloneElement(child, 
     {...props,
      select: hook, 
      })
  })(fps.toArray(props.children))

  return(
    <div hook={hook} >
      {propsToChildren}
    </div>
  )
}

export { HookWrapper, HookForceWrapper, SvgWrapper }
