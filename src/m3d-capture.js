"use strict";
import {EventEmitter} from 'events';
import pcap from 'pcap2';
import core from './m3d-capture-core';

class M3DCapture extends EventEmitter {

  constructor() {
    super();

    this.lastObj = null;

    this.EVENT_JOB_START = 'job start';
    this.EVENT_JOB_FINISH = 'job finish';
    this.EVENT_JOB_CHANGE_STATUS = 'job change-status';
    this.EVENT_DATA_RECEIVE = 'data recv';
    this.EVENT_PRINTER_CHANGE_STATUS = 'printer change-status';
  }

  run(interfaceName, options = {}) {
    var tcpTracker = new pcap.TCPTracker();
    var pcapSession = new pcap.Session(interfaceName, options);

    tcpTracker.on('session', (session) => {
      session.on('data recv', (session, data) => {
        this._onReceivedData(data);
      });
    });

    pcapSession.on('packet', function (rawPacket) {
      var packet = pcap.decode.packet(rawPacket);
      tcpTracker.track_packet(packet);
    });
  }

  _onReceivedData(data) {
    core.toObj(data).then((obj) => {
      if (!this.lastObj) {
        this.lastObj = obj;
      }

      if (!this.lastObj.hasOwnProperty('currentJob') && obj.hasOwnProperty('currentJob')) {
        this.emit(this.EVENT_JOB_START, obj);
      }

      if (this.lastObj.hasOwnProperty('currentJob') && !obj.hasOwnProperty('currentJob')) {
        this.emit(this.EVENT_JOB_FINISH, obj);
      }

      var lastJobStatus = extractJobStatus(this.lastObj);
      var currentJobStatus = extractJobStatus(obj);
      if (lastJobStatus != currentJobStatus) {
        this.emit(this.EVENT_JOB_CHANGE_STATUS, currentJobStatus, lastJobStatus, obj);
      }

      var lastPrinterStatus = extractPrinterStatus(this.lastObj);
      var currentPrinterStatus = extractPrinterStatus(obj);
      if (lastPrinterStatus != currentPrinterStatus) {
        this.emit(this.EVENT_PRINTER_CHANGE_STATUS, currentPrinterStatus, lastPrinterStatus, obj);
      }

      this.emit(this.EVENT_DATA_RECEIVE, obj);
      this.lastObj = obj;
    });
  }
}

function extractJobStatus(obj) {
  if (!obj.hasOwnProperty('currentJob')) {
    return 'Nothing';
  }
  return obj.currentJob.status;
}

function extractPrinterStatus(obj) {
  var status = obj.printerStatus.match(/^Firmware_(.*)$/);
  return status ? status[1] : 'Unknown';
}

export default new M3DCapture();