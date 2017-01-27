import React from 'react';

export default React.createClass({
  getInitialState: function() {
    return {
      player: false
    }
  },
  hasbeenplayed: false,
  shouldComponentUpdate: function(prevProps, prevState){
     let a = this.props.player;
     let b = prevProps.player;
     let ui = this.props.ui;

     let player = document.getElementById("player");
     if (!this.hasbeenplayed && a.cmd == "play"){
         this.hasbeenplayed = true;
         console.log(1);
         return true;
     }
     if(player.paused && a.cmd == "play"){
         return true;
     }

     console.log('in player', player.src, player.paused, a.cmd, a.src);
     
     if(!a.cmd) {
         console.log(2);
        return false;
     }
     if (a.cmd != b.cmd || (a.cmd == "pause" && !player.paused)){
         console.log(3);
        return true;
     }
     if (a.src != player.src && a.cmd == "play") {
         console.log(4);
        return true;
     }
     return false;
  },

  componentDidUpdate: function(prevProps, prevState){
    let player = document.getElementById("player");
    let p = this.props.player;
    player.src = p.src;
    player.load();

    if(p.cmd == "play"){
     player.load();
     setTimeout(function(){player.play()}, 800);

     var isplaying = setInterval(function(){
        console.log('in setInterval')
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
      this._player.pause();
  },
  interact: function (e) {
      this.props.updateplayer({cmd:"pause"});
  },
  render: function() {
    let p = this.props.player;
    let src = p.src;
    console.log(p);
    return (
    <div className="player-container">
    <a className="player-pause" onClick={this.interact}>&nbsp;</a>{" "}
    <a className="player-pause" onClick={this.interact}>&nbsp;</a>{" "}
    <figure>
      <img src={this.props.ui.selectedchannelimage} className="player-image" />
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
      />
      </div>
      <div className="clear"></div>
    </div>

    );
  }
});
