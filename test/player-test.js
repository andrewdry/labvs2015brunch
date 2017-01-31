import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import Player from '../app/components/Player';
import sinon from 'sinon';
import {expect} from 'chai';

describe('<Player />', function(){
  var component, s, updateplayerfunc, updateplayercalled, trackerfunc = undefined;
  beforeEach(function(){
    s = {};
    s.player = {
      cmd: "pause", // "play", "pause"
      program: {title:"title", subtitle:"subtitle"},
      src: "http://sverigesradio.se/topsy/direkt/132.mp3"
    };
    s.ui = {
      selectedchannelid: 132,
      selectedchannelimage: '132-image',
      display: "guide"
    }
    trackerfunc = function() {}
    updateplayerfunc = function(obj){ updateplayercalled = obj }

    })
  it('shold be paused by default', function(){
    component = ReactTestUtils.renderIntoDocument(
      <Player player={s.player} ui={s.ui} updateplayer={updateplayerfunc} tracker={trackerfunc}/>
      );
    let audio  = ReactTestUtils.findRenderedDOMComponentWithTag(component,'audio');
    expect(audio).to.be.ok;
    expect(audio.paused).to.equal(true);
  });
  it('should play audio if given play command', function(){
    let playercomponent = ReactTestUtils.renderIntoDocument(
      <Player player={s.player} ui={s.ui} updateplayer={updateplayerfunc} tracker={trackerfunc}/>
    );
    expect(playercomponent.props.player.cmd).to.equal('pause');
    s.player.cmd = 'play';
    playercomponent.setState(s);
    expect(playercomponent.props.player.cmd).to.equal('play');
  });
  it('should fire tracker call if component did mount with play', function(){
    let playercomponent = ReactTestUtils.renderIntoDocument(
      <Player player={s.player} ui={s.ui} updateplayer={updateplayerfunc} tracker={trackerfunc}/>
    );
    let trackercalled = false;
    s.player.cmd = 'play';
    playercomponent.componentDidUpdate = function(prevProps, prevState){
      trackercalled = true;
    }
    playercomponent.setState(s);
    expect(trackercalled).to.equal(true);
  });
  it('should pause audio if pause links are pressed', function(){
    s.player.cmd = 'play';
    let playercomponent = ReactTestUtils.renderIntoDocument(
      <Player player={s.player} ui={s.ui} updateplayer={updateplayerfunc} tracker={trackerfunc}/>
    );
    let pauselinks = ReactTestUtils.scryRenderedDOMComponentsWithTag(component,'a');
    expect(pauselinks.length).to.equal(2);
    ReactTestUtils.Simulate.click(pauselinks[0]);
    expect(updateplayercalled).to.deep.equal({cmd:"pause"});
  });

});
