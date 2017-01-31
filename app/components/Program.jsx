import React from 'react';


export default React.createClass({
 getInitialState: function(){
   return {}
 },
  programs: function() {
    // sort the programs then show
    let obj = {};
    let p = this.props.programs || [];
    for(let i=0;i<p.length; i++){
       let str = p[i];
       if(!str.archived === true) {
         if(!obj[str.name.charAt(0).toUpperCase()]){
             obj[str.name.charAt(0).toUpperCase()] = [];
         }
         obj[str.name.charAt(0).toUpperCase()].push(str);
       }
    }

    let items = function(arr){
      return arr.map(function(c, n){
        return (
        <li key={n}>
           <div className="program">
              <img src={c.programimage} className="small"/>
              <div className="content-item">
                <span className="title">{c.name}</span>
                <p className="description">{c.description}</p>
                <span className="small"></span>
             </div>
          </div>
        </li>
        );
      });
      };
      let keys = Object.keys(obj).sort();
      let result = [];

      for(let k=0;k<keys.length;k++){

        result.push(
        <div key={k} className="program-bundle"><span className="program-key">{keys[k]}</span>
          <ul>{items(obj[keys[k]])}</ul>
        </div>);
      }

      return result;

  },

    render: function(){
       return (
       <div className="program-group program-list">{this.programs()}</div>
       )
    }
});
