import React from 'react';
import { SketchPicker } from 'react-color';

class UserTable extends React.Component{
  constructor(props){
    super(props);

    this.state = {
      colorOpen : false
    }
  }
  
  handleChangeComplete(col){

    console.log(col);
  }
  
  render(){

    const user = this.props.user;
    if(user == null){return null;}
    //if( typeof(user.color) == "undefined" ){return null;}

    console.log(user);
    //console.log(user.color);
    
    return <div className="friend">
      <div className="table">
        
        <div className="table-header">
          <div className="table-cell">ID</div>
          <div className="table-cell">Role</div>
          <div className="table-cell">ChangeRole</div>
          <div className="table-cell">Color</div>
          <div className="table-cell">Info</div>
          <div className="table-cell">Select</div>
        </div>
        
        <div className="table-row">
          <div className="table-cell">{user.id}</div>
          <div className="table-cell">{user.role}</div>
          <div className="table-cell">
            <select select={user.role} onChange={e => this.props.onChangeRole(user.id, parseFloat(e.target.value) )}>
            <option value="0">0</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
            </select>
          </div>
          <div className="table-cell">
            {/*{!this.state.colorOpen &&
              <button style={{background: `rgba(${user.color.r} , ${user.color.g}, ${user.color.b}, ${user.color.a})`}} onClick={e => this.setState({ colorOpen : true }) }></button>
            }
            {this.state.colorOpen && 
              <>
                <SketchPicker
                color={ user.color }
                onChangeComplete={ this.handleChangeComplete }
                />
                <button onClick={e => this.setState({ colorOpen : false }) }>close</button>  
              </>
            }*/}
          </div>

          <div className="table-cell">
            <button onClick={e => console.log(user)}>Player Info</button>
          </div>
          <div className="table-cell">
            <button onClick={this.props.onSelect}>Select</button>
          </div>
        
        </div>
      </div>                    
    </div>

  }
}

UserTable.defaultProps = {
  user : null,
  onSelect: ()=>{},
  onChangeRole: (id, e)=>{}
}

export default UserTable;