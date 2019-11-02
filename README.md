## Reacthelpers  
Just some functions I tend to use in a lot of different places.  

### HookWrappers are for testing hooks -  
They provide a generic element that takes a hook argument to allow testing  
the hook outside of any specific context.  
I have several variations to handle passing hooks to children and testing  
elements that rely on hooks for what they render, but they are all similar.  
#### The wrappers just set up a very simple component to use the hook  
That is really all they do. They take the hook you want to test, then you  
find and use the hook calls directly.  

#### Hooks are passed as functions in case you need to configure them  
Just use an arrow function with no args if the hook does not need any.  
```javascript
  let wrapper = shallow(<HookWrapper hook={() => useMouseStatus()}  />) 
```
#### Using HookWrapper vs HookForceWrapper just depends on the hook  
The setup is the same, it just depends on whether the hook has useRef()  
variables that you want to be able to force update, thats it.  
```javascript
  let wrapper = shallow(<HookWrapper hook={() => useMouseStatus()}  />) 
  let wrapper = mount(<HookForceWrapper  hook={() => useMouseLocation()}  />) 
```

#### The SvgWrapper is just a convenience wrapper for svg components -  
This wrapper passes all arguments to children and uses an `<svg>` element  
instead of a div.  
I used it because I have many components that pass props to children and  
end up rendering svg specific elements.  


### passProp functions pass props to children -  
I was repeating this pattern frequently so I made general purpose functions  
to take children/props you want to pass and return the modified children.  
I mostly use the passExceptChildren because I almost never what the children  
to be passed when doing this.  
#### Slight variations; pass all props, given props, all but children  
```javascript
// Pass given props to children, avoiding passing children
let pass = R.pipe(R.dissoc('height'), R.dissoc('width'))(props)
pass = { ...pass, var1: val1, var2: val2}
const propsToChildren = passExceptChildren(pass)
// Pass all props
const propsToChildren = passAllProps(props)
// Pass selected props
let pass = R.omit(['x','y','startx','starty','endx','endy','clickx','clicky'])(props)
const propsToChildren = passGivenProps(pass)
```

### Rounding  
Seem silly, but I was creating functions for rounding in a number of places  
so I put them here.  
roundtenth, roundhundth, roundthousth

### Highlight/dehighlight  
For interactive maps/displays I often wanted to highlight but then return the  
element to the original style, which would frequently change.  
createHighlight() returns highlight/dehighlight fcns that have clousure around  
shared data so they can track style changes.  

