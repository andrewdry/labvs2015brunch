import React from 'react';
import NavItem from './NavItem';

export default React.createClass({
    // return channels array ui fixed
    getInitialState: function(){
     return {}
    },

    navItems: function() { return (this.props.channels || []).map(function(c, n){
      console.log(c, n, '<<<<<<<<')
      return <NavItem key={n} image={c.image} name={c.name} id={c.id} color={c.color} />;
    })},

    render: function(){
       return (
       <nav>{this.navItems()}</nav>
       );
    }
});
