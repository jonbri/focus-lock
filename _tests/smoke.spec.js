import {expect} from 'chai';

import {focusInside, focusMerge} from '../src/';
import {FOCUS_AUTO} from "../src/constants";

describe('smoke', () => {
  const createTest = () => {
    document.body.innerHTML = `    
    <div id="d1"> 
    <button>1</button>
    <button>2</button>
    </div>
    <div id="d2">
    <button>3</button>
    <button>4</button>
    </div>
    <div id="d3">
    <button>3</button>
    <button>4</button>
    </div>
    <div id="d4" tabindex="0">    
    </div>
    `;
  };

  describe('FocusInside', () => {
    it('false - when there is no focus', () => {
      createTest();
      expect(focusInside(document.body)).to.be.equal(true);
      expect(focusInside(document.querySelector('#d1'))).to.be.equal(false);
      expect(focusInside(document.querySelector('#d2'))).to.be.equal(false);
      expect(focusInside(document.querySelector('#d3'))).to.be.equal(false);
      expect(focusInside(document.querySelector('#d4'))).to.be.equal(false);
    });

    it('true - when focus in d1', () => {
      createTest();
      document.querySelector('#d1 button').focus();
      expect(focusInside(document.body)).to.be.equal(true);
      expect(focusInside(document.querySelector('#d1'))).to.be.equal(true);
      expect(focusInside(document.querySelector('#d2'))).to.be.equal(false);
    });

    it('true - when focus on d4 (tabbable)', () => {
      createTest();
      document.querySelector('#d4').focus();
      expect(focusInside(document.body)).to.be.equal(true);
      expect(focusInside(document.querySelector('#d4'))).to.be.equal(true);
      expect(focusInside(document.querySelector('#d1'))).to.be.equal(false);
    });

    it('multi-test', () => {
      createTest();
      document.querySelector('#d1 button').focus();
      expect(focusInside(document.body)).to.be.equal(true);
      expect(focusInside(document.querySelector('#d1'))).to.be.equal(true);
      expect(focusInside([document.querySelector('#d1')])).to.be.equal(true);
      expect(focusInside([document.querySelector('#d2')])).to.be.equal(false);
      expect(focusInside([document.querySelector('#d1'), document.querySelector('#d2')])).to.be.equal(true);
      expect(focusInside([document.querySelector('#d2'), document.querySelector('#d3')])).to.be.equal(false);
      expect(focusInside([document.querySelector('#d3'), document.querySelector('#d1')])).to.be.equal(true);
    });
  });

  describe('FocusMerge', () => {
    it('move focus', () => {
      createTest();
      document.querySelector('#d4').focus();
      focusMerge(document.querySelector('#d1'), null).node.focus();
      expect(focusInside(document.querySelector('#d1'))).to.be.equal(true);

      focusMerge(document.querySelector('#d2'), null).node.focus();
      expect(focusInside(document.querySelector('#d2'))).to.be.equal(true);

      expect(focusMerge([document.querySelector('#d2'), document.querySelector('#d3')], null)).to.be.equal(undefined);
      expect(focusInside(document.querySelector('#d2'))).to.be.equal(true);

      focusMerge([document.querySelector('#d3'), document.querySelector('#d4')], null).node.focus();
      console.log(document.activeElement.id);
      expect(focusInside(document.querySelector('#d3'))).to.be.equal(true);
    });

    it('autofocus - should pick first available tabbable', () => {
      document.body.innerHTML = `    
        <div id="d1"> 
        <span>
            <button tabindex="-1">1</button>
        </span>
        <button>2</button>
        </div>    
    `;
      expect(
        focusMerge(document.querySelector('#d1'), null).node.innerHTML
      ).to.be.equal("2");
    })

    it('autofocus - should pick first available focusable if pointed', () => {
      document.body.innerHTML = `    
        <div id="d1"> 
        <span ${FOCUS_AUTO}>
            <button tabindex="-1">1</button>
        </span>
        <button>2</button>
        </div>    
    `;
      expect(
        focusMerge(document.querySelector('#d1'), null).node.innerHTML
      ).to.be.equal("1");
    })

    it('autofocus - should include readonly textarea', () => {
      document.body.innerHTML = `
        <div id="d1">
        <textarea readonly>content</textarea>
        </div>
    `;
      expect(
        focusMerge(document.querySelector('#d1'), null).node.innerHTML
      ).to.be.equal("content");
    })

  });

});