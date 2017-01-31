import React from 'react';
import NavItem from './NavItem';

export default React.createClass({
    getInitialState: function(){
     return {}
    },

    navItems: function() {
    let fn = this.props.updateState;
    return (this.props.channels || []).map(function(c, n){
      return <NavItem key={n}  channel={c} updateState={fn}/>;
    })},

    render: function(){
       return (
       <div>{this.navItems()}</div>
       );
    }
});
