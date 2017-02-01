import React from 'react';
import {renderIntoDocument,findRenderedDOMComponentWithClass,findRenderedDOMComponentWithTag,Simulate,scryRenderedDOMComponentsWithTag} from 'react-addons-test-utils';
import Nav from '../app/components/Nav';
import Navitem from '../app/components/NavItem';
import {expect} from 'chai';

describe('<Nav />', function(){
  var channel,navitemfunccalled, navitemfunc,navfunc, navfunccalled, component = undefined;
  beforeEach(function(){
    channel = {id:'132', name:'P1', image:'image-132'}
    navitemfunc = function(obj){ navitemfunccalled = obj }
    navfunc = function(obj){ navfunccalled = obj }

  });

  it('should render list of clickable channel images', function(){
    let channels = [];
    channels.push(channel);
    component = renderIntoDocument(<Nav channels={channels} updateState={navfunc} />);
    let navitemImage  = findRenderedDOMComponentWithTag(component,'img').src;
    expect(navitemImage).to.equal('image-132');

    let navitemLink = findRenderedDOMComponentWithTag(component,'a');
    Simulate.click(navitemLink);
    expect(navfunccalled).to.equal(channels[0]);
  });

  describe('<Navitem />', function(){
    it('should render a dom element with className navitem', function() {
      component = renderIntoDocument(<Navitem channel={channel} updateState={navitemfunc}/>);
      let navitem  = findRenderedDOMComponentWithClass(component,'navitem');
      expect(navitem).to.be.ok
    });
    it('should call updateState with the channel properties set on component', function() {
      component = renderIntoDocument(<Navitem channel={channel} updateState={navitemfunc}/>);
      const link = findRenderedDOMComponentWithTag(component, 'a');
      Simulate.click(link);
      expect(navitemfunccalled).to.equal(channel);

    });
  });
});
