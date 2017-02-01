import React from 'react';
import {renderIntoDocument,findRenderedDOMComponentWithClass,findRenderedDOMComponentWithTag,Simulate,scryRenderedDOMComponentsWithTag} from 'react-addons-test-utils';
import Channel from '../app/components/Channel';
import Guide from '../app/components/Guide';
import dataprograms from './data/programs-data';
import dataschedule from './data/schedule-data';
import {expect} from 'chai';

describe('<Channel />', function(){

  var testnow, s,updatestatefunc, updatestatecalled, updateplayerfunc,updateplayercalled,component = undefined;

  beforeEach(function(){
    testnow = new Date(1485731000000);
    s = {programs: dataprograms, schedule: dataschedule, ui: {
      selectedchannelid: 163,
      selectedchannelimage: "image-163",
      display: "guide"
    }};
    updatestatecalled = false;
    updatestatefunc = function(obj){ updatestatecalled = obj }
    updateplayerfunc = function(obj){ updateplayercalled = obj }
    component = renderIntoDocument(
      <Channel programs={s.programs} schedule={s.schedule} ui={s.ui} update={updatestatefunc} updateplayer={updateplayerfunc}/>
      );

  });

  it('should toggle between <Program /> and <Guide /> and update state', function(){
    let links = scryRenderedDOMComponentsWithTag(component,'a');
    expect(links.length).to.equal(2);
    let guidelink = links[0];
    let programlink = links[1];
    Simulate.click(programlink);
    expect(updatestatecalled.ui.display).to.equal('program');
    Simulate.click(guidelink);
    expect(updatestatecalled.ui.display).to.equal('guide');
  });
  it('should by default render <Guide />', function(){
    let guide  = findRenderedDOMComponentWithTag(component,'ul').className;
    expect(guide).to.equal('guide');
  });

  describe('<Guide />', function(){
    it('shoule update player state when play btn pressed', function(){
      let guidecomponent = renderIntoDocument(
        <Guide schedule={s.schedule} updateplayer={updateplayerfunc} now={testnow}/>
      );
      let links = scryRenderedDOMComponentsWithTag(guidecomponent,'a');
      let playbtn = links[0];
      expect(playbtn.className).to.contain('btn');
      Simulate.click(playbtn);
      expect(updateplayercalled.cmd).to.equal('play');
      expect(updateplayercalled.player.channel).to.be.ok;
      expect(updateplayercalled.player.title).to.be.ok;

    });
  });
  describe('<Program />', function(){
    it('should render <Program /> on program link click', function(){
      // Change component props before calling component like setState func
      let ui = s.ui;
      // set program as selected views
      ui.display = "program";
      let programcomponent =  renderIntoDocument(
        <Channel programs={s.programs} schedule={s.schedule} ui={ui} update={updatestatefunc} updateplayer={updateplayerfunc}/>
      );
      let program = findRenderedDOMComponentWithClass(programcomponent,'program-list');
      expect(program).to.be.ok;
    });
  });
});
