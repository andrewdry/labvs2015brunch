import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import App from '../app/components/App';
import sinon from 'sinon';
import {expect} from 'chai';

describe('<App />', function(){
  var component, trackerfunc, trackercalled, fetchfunc, fetchcalled = undefined;
  beforeEach(function(){
    component = ReactTestUtils.renderIntoDocument(<App />);

  });
  it('should not have a default selected channel', function(){
    expect(component.state.ui.selectedchannelid).to.equal(null);
  });
  describe('<Fetch />', function(){
    it('should get channels from SR-API through on componentWillMount', function(){
      let getChannelsCalled = "notCorrectUrl";
      component.get = function(url, prop){
         return new Promise(function(resolve, reject){
           getChannelsCalled = url;
           resolve([]);
         });
       }
      component.componentWillMount(); // i do trust reacts lifecycle
      expect(getChannelsCalled).not.to.equal("notCorrectUrl");
      expect(getChannelsCalled).to.contain("channels");

    });
    it('should update schedule and programs if channel has changed', function(){
      let counter = 0;
      component.get = function(url, prop){
         return new Promise(function(resolve, reject){
           counter++;
           resolve([]);
         });
       }
       component._cache.ui.selectedchannelid = 163;
       component.getProgramsForChannel({id: -1});
       expect(counter).to.equal(2);
    });

    it('should not update schedule and programs if channel has not changed', function(){
      let counter = 0;
      component.get = function(url, prop){
         return new Promise(function(resolve, reject){
           counter++;
           resolve([]);
         });
       }
       component._cache.ui.selectedchannelid = 163;
       component.getProgramsForChannel({id: 163});
       expect(counter).to.equal(0);
    });
  });
  describe('<Tracker />', function(){
      it('should be called when updatePlayer in <App /> is invoked', function(){
        let trackercalled = false;
        component.postTrackToApi = function(channelId, channelImage, callback){
           trackercalled = true;
        }
        component.tracker();
        expect(trackercalled).to.equal(true);
      })
  });
});
