import React from 'react';

const Utils = {
  guid: () => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0,
        v = c == "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  },
  injectPropsToAllChildren(children, newProps) {
    //Handle single Children
    if (!Array.isArray(children) && children.type != "button") {
      return React.cloneElement(children, { ...newProps });
    }
    if (children.type === "button") {
      return children;
    }
    //Handle multiple Children
    let realChildren = children.filter((__child) => typeof (__child) != "undefined");
    const newChildren = React.Children.toArray(realChildren).map(child => {
      const childzFurtherChildren = child.props.children
        ? Utils.injectPropsToAllChildren(child.props.children, newProps)
        : undefined;

      return childzFurtherChildren
        ? React.cloneElement(child, { ...newProps }, childzFurtherChildren)
        : React.cloneElement(child, { ...newProps });
    });
    return newChildren;
  }
}

export default Utils;