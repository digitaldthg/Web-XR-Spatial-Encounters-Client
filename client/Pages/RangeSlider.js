import React from 'react';

class RangeSlider extends React.Component{
  constructor(props){
    super(props);
  }


  render(){
    return <div className="">
      <label>{this.props.name}</label>
      <input type="range" min="0" max="1" step="0.01" value={this.props.value} onChange={e => this.props.onChange(parseFloat(e.target.value) )}/> 
      <span>{this.props.value}</span>
    </div>
  }
}

RangeSlider.defaultProps = {
  value: 0,
  name : "RangeSlider",
  onChange : (value)=>{}
}

export default RangeSlider;