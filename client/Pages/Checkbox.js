import React from 'react';


class Checkbox extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return <div className="checkbox">
            <input type="checkbox" checked={this.props.checked} onChange={ e => this.props.onChange(e.target.checked) } onInput={ e => this.props.onChange(e.target.checked) }/>
        </div>
    }
}

Checkbox.defaultProps = {
    checked : false,
    onChange : (val)=>{}
}

export default Checkbox;