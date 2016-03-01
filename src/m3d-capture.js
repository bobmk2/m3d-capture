"use strict";
import pcap from 'pcap2';
import core from 'm3d-core';

class M3DCapture {

  constructor(){
    super();

    this.EVENT_JOB_START = 'job start';
    this.EVENT_JOB_FINISH = 'job finish';
    this.EVENT_JOB_CHANGE_STATUS = 'job change-status';
    this.EVENT_DATA_RECEIVE = 'data recv';
  }

  run(deviceName, option = {}) {
    var tcpTracker = new pcap.TCPTracker();
    var pcapSession = new pcap.Session(deviceName, option);

    tcpTracker.on('session', (session) => {
      session.on('data recv', (session, data) => {
        core.onReceivedData(data);
      });
    });

    pcapSession.on('packet', function (rawPacket) {
      var packet = pcap.decode.packet(rawPacket);
      tcpTracker.track_packet(packet);
    });
  }
}

export default new M3DCapture();