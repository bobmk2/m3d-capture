import assert from 'power-assert';
import sinon from 'sinon';

import capture from '../src/m3d-capture';

describe('M3DCapture', () => {
  describe('on', () => {
    context('when support events are set', () => {
      it('should get true and set emit event', () => {
        var events = [
          capture.EVENT_JOB_START,
          capture.EVENT_JOB_FINISH,
          capture.EVENT_JOB_CHANGE_STATUS,
          capture.EVENT_DATA_RECEIVE
        ]
        events.forEach((event) => {
          assert(capture.getListenerCount(event) === 0);
          var r = capture.on(event, () => {});
          assert(r === true);
          assert(capture.getListenerCount(event) === 1);
        });
      });
    });
    context('when un-support events are set', () => {
      it('should get false and not set emit event', () => {
        var events = [
          'un-support test',
          'is not accepted'
        ]
        events.forEach((event) => {
          assert(capture.getListenerCount(event) === 0);
          var r = capture.on(event, () => {});
          assert(r === false);
          assert(capture.getListenerCount(event) === 0);
        });
      });
    });
  })
});