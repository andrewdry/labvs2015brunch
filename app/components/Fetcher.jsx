module.exports = function(url){
   return new Promise(function(resolve, reject){

     let reqListener = function() {
       var data = JSON.parse(this.responseText);
       resolve(data);
     }

     var reqError = function(err) {
       reject('Fetch Error :-S', err);
     }

     var oReq = new XMLHttpRequest();
     oReq.addEventListener("load", reqListener);
     oReq.addEventListener("error",reqError);
     oReq.open("GET", url, true);
     oReq.overrideMimeType('application\/json; charset=utf-8');
     oReq.send();
   });
};
