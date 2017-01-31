import React from 'react';
import Program from './Program';
import Guide from './Guide';

export default React.createClass({
    // return channels array ui fixed
    getInitialState: function(){
     return {
     }
    },
    toggle: function(data){
        let ui = this.props.ui;
        ui.display = data;
        this.props.update({ui: ui});
    },
    render: function(){
       let programs = this.props.programs;
       let schedule = this.props.schedule;
       let player = this.props.updateplayer;
       let now = this.props.now;
       let content = this.props.ui.display === "guide" ? <Guide schedule={schedule} updateplayer={player} now={now}/> :<Program programs={programs}/>;
       return (
       <div>
           <div className="toggler">
              <img src={this.props.ui.selectedchannelimage} className="channelimage"/>
              <a onClick={() => this.toggle("guide")} className="active">t</a>
              <a onClick={() => this.toggle("program")}>p</a>
           </div>
           {content}

       </div>
       );
    }
});
