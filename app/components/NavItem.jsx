import React from 'react';


export default React.createClass({
    navigate: function(e){
      e.preventDefault();
      this.props.updateState(this.props.channel);
    },
    styles: function(color){
      return {

      }
    },
    defaultProps: {color:'red'},
    render: function(){
       let c = this.props.channel;
       return (
         <div style={this.styles(this.props.color)} className="navitem">
           <a onClick={this.navigate}><img src={c.image} width="100%" /></a>
         </div>
       )
    }
});
