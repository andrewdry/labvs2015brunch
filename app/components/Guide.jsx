import React from 'react';


export default React.createClass({
 getInitialState: function(){
   return {}
 },
 play: function(obj){

     this.props.updateplayer({player: obj, cmd: "play"});
 },
 guide: function(){
    let _self = this;
    let parseaspdate = function(str){
        let d = (/-?\d+/).exec(str)[0]
        return new Date(parseInt(d, 10));
    }

    let guide = (this.props.schedule || []).map(function(s,n){
      let start = parseaspdate(s.starttimeutc);
      let end = parseaspdate(s.endtimeutc);
      let starthour = (start.getHours() < 10 ? "0": "") + start.getHours();
      let startmin= (start.getMinutes() < 10 ? "0": "") + start.getMinutes();
      let now = new Date();
      let show = (start.getTime() >= now.getTime() || now.getTime() < end.getTime()) ? "" : "hide";
      let isplaying = (start.getTime() <= now.getTime() && end.getTime() > now.getTime())
      let playbtn = isplaying ? <a href="#" className="btn" onClick={() => _self.play(s)}> Spela upp </a> : "";
      let playing = isplaying ? <span className="playing">*** I sändning *** </span> : "";
      let playimage = isplaying ? <img src={s.imageurl} className="playimage"/> : "";
      // get more data through s.episodeid and api call
      return (
         <li className={show} key={n}>
               <div className="schedule">
               <div>{playing}</div>
               <span className="time">{starthour}:{startmin}</span>{" | "}
               <span className="title">{s.title}{" "}{s.subtitle}</span>{" "}
               <p>{s.description}</p>
               {playbtn}
               </div>
         </li>
       );
    });

    return guide;

  },
  render: function(){
    return (<div className="program-group"><ul className="guide">{this.guide()}</ul></div>);
  }
});
