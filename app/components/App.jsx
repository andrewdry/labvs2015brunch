import React from 'react';
import Fetcher from './Fetcher';
import Channel from './Channel';
import Nav from './Nav';


export default React.createClass({
   getInitialState: function(){
       return {
         data: {

         },
         player: {

         },
         ui: {
           selectedchannelid: null,
           channeldisplay: "programs",
           activeprogramend: null,

         }
      }
   },
   // Local Variables for the UI
   _var: {
     data: {

     },
     player: {

     },
     ui: {
       selectedchannelid: null,
       channeldisplay: "programs",
       activeprogramend: null,

     }
   },

   // API functions
   getChannels: function(){

     return new Promise(function(resolve, reject){
       var url = "http://api.sr.se/api/v2/channels?pagination=false&format=json&indent=true&filter=channel.channeltype&filtervalue=Rikskanal";
       var fetcher = Fetcher(url)
         .then(function(val){
             var channels = [];
             val.channels.forEach(function(c){
                channels.push({["channel."+c.id+""]: c});
             });
             resolve(val.channels);
            })
          .catch(function(err){
             reject(err);
          });
       });
   },

   // State updater
   updateState: function(obj){
     this._var = obj;
     this.setState(obj);
   },

   componentWillMount: function(){
      var _self = this;
      this.getChannels()
        .then(function(val){
           _self.updateState({data: {channels:val}})
         })
        .catch(function(err){console.log(err)});
   },

   render: function() {
   var nav = this._var.data.channels;
    return (
      <div id="content">
        <h4><i>Schwedische</i></h4>
        <h1>Rundfunk</h1>

        <Nav channels={this._var.data.channels} />
      </div>
    );
  }
});
