import React from 'react';

export default React.createClass({
  getInitialState: function() {
    return {
      player:this.props.player,
      ui:this.props.ui
    }
  },
  hasbeenplayed: false,
  shouldComponentUpdate: function(prevProps, prevState){
     let a = this.props.player;
     let b = prevProps.player;
     let ui = this.props.ui;
     //console.log(a);
     let player = this.refs._player; //document.getElementById("player");
     if (!this.hasbeenplayed && a.cmd == "play"){
         this.hasbeenplayed = true;
         //console.log(1);
         return true;
     }
     if(player.paused && a.cmd == "play"){
         return true;
     }

     if(!a.cmd) {
         //console.log(2);
        return false;
     }
     if (a.cmd != b.cmd || (a.cmd == "pause" && !player.paused)){
         //console.log(3);
        return true;
     }
     if (a.src != player.src && a.cmd == "play") {
         //console.log(4);
        return true;
     }
     return false;
  },

  componentDidUpdate: function(prevProps, prevState){
    let player = this.refs._player; //document.getElementById("player");
    let p = this.props.player;
    player.src = p.src;
    player.load();

    if(p.cmd == "play"){
     player.load();
     setTimeout(function(){player.play()}, 800);

     var isplaying = setInterval(function(){
        //console.log('in setInterval')
        if(!player.paused && !player.ended && 0 < player.currentTime){
            clearInterval(isplaying);
        } else {
            if (!player.src) {
                player.src = p.src;
                player.load();
            }
            player.load();
            player.play();
        }
     }, 1000);
     this.props.tracker();
    }
    if(p.cmd == "pause"){
        player.pause();
    }


  },
  componentWillUnmount: function() {
      this.refs._player.pause();
  },
  interact: function (e) {
      this.props.updateplayer({cmd:"pause"});
  },
  render: function() {
    let p = this.props.player;
    let src = p.src;
    let image = this.props.ui.selectedchannelimage;
    return (
    <div className="player-container">
    <a className="player-pause" onClick={this.interact}>&nbsp;</a>{" "}
    <a className="player-pause" onClick={this.interact}>&nbsp;</a>{" "}
    <figure>
      <img src={image} className="player-image" />
    </figure>
    <div className="player-content">
    <span className="player-title">
      {p.program.title}{" "}{p.program.subtitle}
    </span>

      <audio
        controls="controls"
        className="player"
        id="player"
        preload="false"
        ref="_player"
      />
      </div>
      <div className="clear"></div>
    </div>

    );
  }
});
