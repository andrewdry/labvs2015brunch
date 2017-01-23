import React from 'react';


export default React.createClass({
    fn_navigate: function(e){
      e.preventDefault();
      console.log(e.currentTarget, e, this.props);
      //this.props.selectChannelFn(163);
    },
    styles: function(color){
      return {

      }
    },
    defaultProps: {color:'red'},
    render: function(){
       return (
         <div style={this.styles(this.props.color)} className="navitem">
           <a onClick={this.fn_navigate} data-channelid="{this.props.id}"><img src={this.props.image} width="100%" /></a>
         </div>
       )
    }
});
