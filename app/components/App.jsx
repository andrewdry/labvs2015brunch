import React from 'react';
import Fetcher from './Fetcher';
import Tracker from './Tracker';
import Channel from './Channel';
import Nav from './Nav';
import Player from './Player';
var Promise = require('bluebird');


export default React.createClass({
   getInitialState: function(){
       return {
       channels: [],
       programs: [],
       schedule:[],
       player: {
           cmd: "pause", // "play", "pause"
           program: {},
           src: "http://sverigesradio.se/topsy/direkt/132.mp3"
       },
       ui: {
         selectedchannelid: null,
         selectedchannelimage: null,
         display: "guide"
       }
      }
   },

   _cache: {
     channels: [],
     programs: [],
     schedule:[],
     player: {
       cmd: "pause", // "play", "pause"
       program: {},
       src: "http://sverigesradio.se/topsy/direkt/132.mp3"
     },
     ui: {
       selectedchannelid: null,
       selectedchannelimage: null,
       display: "guide"
     }
  },

   // API functions
   get: function(url, prop){
      return new Promise( function (resolve, reject) {
      var fetcher = Fetcher(url)
        .then(function(val){
            let r = val[prop];
            resolve(r);
        })
        .catch(function(err){
           reject(err);
        });
      });

   },
   getChannels: function(){
     let usefilter = true;
     var filter = usefilter ? "&filter=channel.channeltype&filtervalue=Rikskanal" : "";
     var url = "http://api.sr.se/api/v2/channels?pagination=false&format=json" + filter;
     var _self = this;
     this.get(url,"channels")
     .then(function(val){
         _self.updateState({channels:val});
     });
   },

   getProgramsForChannel: function(channel) {
     // ToDo internal cache check
    if(this._cache.ui.selectedchannelid === channel.id) { return; }
     var _self = this;
     let urls = [
        {u: "http://api.sr.se/api/v2/programs/index?channelid="+channel.id+"&format=json&pagination=false", v: "programs"},
        {u: channel.scheduleurl + "&format=json&pagination=false", v: "schedule"}
        ];
     for(var i=0;i<urls.length;i++){
        let act = urls[i]
        this.get(act.u, act.v)
        .then(function(val){
            let obj = {}
            obj[act.v] = val;
            let ui = _self._cache.ui;
            ui.selectedchannelid = channel.id;
            ui.selectedchannelimage = channel.image;
            ui.display = "guide"; // always reset
            _self.updateState(_self.mergeObjects({}, obj, {ui:ui}));
        });
     }
   },

    // ie Object.assign function
   mergeObjects:  function() {
       var resObj = {};
       for(var i=0; i < arguments.length; i += 1) {
           var obj = arguments[i],
               keys = Object.keys(obj);
           for(var j=0; j < keys.length; j += 1) {
               resObj[keys[j]] = obj[keys[j]];
           }
       }
       return resObj;
   },

   // State updater
   updateState: function(obj){
     this._cache = this.mergeObjects(this._cache, obj);
     this.setState(obj);
   },
   // Update player
   updatePlayer: function(obj){
     let player = this._cache.player;
     let c = this._cache;
      // Deal with pausing
      if(obj.cmd == "pause"){
        player.cmd = "pause";
        this.updateState({player: player});
        return;
      }

      // find channel live src from _cache
      let url = c.channels.filter(function(channel){
          return c.ui.selectedchannelid == channel.id
      })[0].liveaudio.url;

      let update = false;
      // play or pause
      if (obj.cmd != player.cmd) {
          player.cmd = obj.cmd;
          update = true;
      }
      if (url != player.src){
          player.src = url;
          update = true;
      }

      if(update){
          player.program = obj.player;
          this.updateState({player: player});
      }
   },
   postTrackToApi: Tracker,
   tracker: function(){
       var c = this._cache;
       this.postTrackToApi(c.ui.selectedchannelid, c.ui.selectedchannelimage, function(res){console.log('tracking')});
   },
   componentWillMount: function(){
      this.getChannels();
   },

   render: function() {
    let s = this._cache;
    let navcontent = s.channels.length > 0 ?
       <Nav channels={s.channels} updateState={this.getProgramsForChannel} className="nav" /> : ''
    let bodycontent = s.programs.length > 0 && s.ui.selectedchannelid?
       <Channel programs={s.programs} schedule={s.schedule} ui={s.ui} update={this.updateState} updateplayer={this.updatePlayer}/> : ""

    return (
        <div>
        <nav>{navcontent}</nav>
        <div className="audio-player">
           <Player player={s.player} ui={s.ui} updateplayer={this.updatePlayer} tracker={this.tracker}/>
        </div>
        <section className="content-body">{bodycontent}</section>
       </div>
    );
  }
});
