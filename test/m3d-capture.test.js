import assert from 'power-assert';
import sinon from 'sinon';

import capture from '../src/m3d-capture';

describe('M3DCapture', () => {

  var errTimeout = setTimeout(() => {
    assert(false, 'Event never fired');
    done();
  }, 500);

  describe('_onReceivedData', () => {
    afterEach((done) => {
      capture.removeAllListeners();
      capture.lastObj = null;
      done();
    });

    context('when job is started', () => {
      beforeEach(() => {
        var obj = getInfoObj();
        delete obj.currentJob
        capture.lastObj = obj;
      });
      it('should emit start event', (done) => {
        capture.on('job start', (obj) => {
          clearTimeout(errTimeout);
          assert(true);
          done();
        });
        capture._onReceivedData(printingXmlStr);
      });
      it('should change job status from nothing to something', (done) => {
        capture.on('job change-status', (newStatus, oldStatus, obj) => {
          clearTimeout(errTimeout);
          assert(oldStatus === 'Nothing');
          assert(newStatus === 'Printing');
          done();
        });
        capture._onReceivedData(printingXmlStr);
      });
    });

    context('when job is finished', () => {
      beforeEach(() => {
        capture.lastObj = getInfoObj();
      });
      it('should emit finish event', (done) => {
        capture.on('job finish', (obj) => {
          clearTimeout(errTimeout);
          assert(true);
          done();
        });
        capture._onReceivedData(nonPrintingXmlStr);
      });
      it('should change job status to nothing', (done) => {
        capture.on('job change-status', (newStatus, oldStatus, obj) => {
          clearTimeout(errTimeout);
          assert(oldStatus === 'Printing');
          assert(newStatus === 'Nothing');
          done();
        });
        capture._onReceivedData(nonPrintingXmlStr);
      });
    });

    context('when job status is changed', () => {
      before(() => {
        var o = getInfoObj();
        o.currentJob.status = "beforeTest";
        capture.lastObj = o;
      });
      it('should emit status changed event', (done) => {
        capture.on('job change-status', (newStatus, oldStatus, obj) => {
          clearTimeout(errTimeout);
          assert(newStatus === 'Printing');
          assert(oldStatus === 'beforeTest');
          done();
        });
        capture._onReceivedData(printingXmlStr);
      });
    });

    context('when printer status is changed', () => {
      before(() => {
        var o = getInfoObj();
        o.printerStatus = "Firmware_BeforeTest";
        capture.lastObj = o;
      });
      it('should emit status changed event', (done) => {
        capture.on('printer change-status', (newStatus, oldStatus, obj) => {
          clearTimeout(errTimeout);
          assert(newStatus === 'Printing');
          assert(oldStatus === 'BeforeTest');
          done();
        });
        capture._onReceivedData(printingXmlStr);
      });
    });

    context('when printer status is unexpected it', () => {
      before(() => {
        var old = getInfoObj();
        old.printerStatus = "unexpected";
        capture.lastObj = old;
      });
      it('should get printer status, Unknown', (done) => {
        capture.on('printer change-status', (newStatus, oldStatus, obj) => {
          clearTimeout(errTimeout);
          assert(oldStatus === 'Unknown');
          done();
        });
        capture._onReceivedData(printingXmlStr);
      });
    });

    context('when received data', () => {
      it('should emit data recv event', (done) => {
        capture.on('data recv', (obj) => {
          clearTimeout(errTimeout);
          assert(true);
          done();
        });
        capture._onReceivedData(printingXmlStr);
      });
    });
  });

  var printingXmlStr = '<SocketBroadcast><SPOOLER__ALL/><PrinterInfo Serialnumber="BL-12-34-56-78-100-200" PrinterStatus="Firmware_Printing"><FilamentInfo Temperature="215" Color="CrystalClear" Type="PLA" Code="ERR" Location="External" /><Extruder Homed="false" InRelativeMode="true" Z_Valid="true" gantry_clips_removed="true" Temperature="213.5205" Fan="0"><LastKnownExtruderLocation X="-1000" Y="-1000" Z="-1000" E="-1000" /></Extruder><Hardware PORT="/dev/tty.usbmodem1421" MACHINE_TYPE="The_Micro" firmware_version="2016012501" bootloader_version="0" hours_used="1.1" LastResetCauseMask="32" firmware_name="Micro3D" firmware_url="unknown" protocol_version="unknown" extruder_count="1" repetier_protocol="2" /><Calibration Calibration_Valid="true" G32_VERSION="1" CORNER_HEIGHT_BACK_RIGHT="0.0988273" CORNER_HEIGHT_BACK_LEFT="0.2928073" CORNER_HEIGHT_FRONT_LEFT="-0.5003253" CORNER_HEIGHT_FRONT_RIGHT="-1.28456163" CORNER_HEIGHT_BACK_RIGHT_OFFSET="0" CORNER_HEIGHT_BACK_LEFT_OFFSET="1" CORNER_HEIGHT_FRONT_LEFT_OFFSET="2" CORNER_HEIGHT_FRONT_RIGHT_OFFSET="3" ENTIRE_Z_HEIGHT_OFFSET="4" BACKLASH_X="0.322101861" BACKLASH_Y="0.7756652" BACKLASH_SPEED="1500" /><CurrentJob JobName="test job" User="test user" PercentComplete="0.25813365" PreviewImageFileName="null" Status="Printing" /><Logging Waits="false" Feedback="false" /></PrinterInfo></SocketBroadcast><EOF>';
  var nonPrintingXmlStr = '<SocketBroadcast><SPOOLER__ALL/><PrinterInfo Serialnumber="BL-12-34-56-78-100-200" PrinterStatus="Firmware_Printing"><FilamentInfo Temperature="215" Color="CrystalClear" Type="PLA" Code="ERR" Location="External" /><Extruder Homed="false" InRelativeMode="true" Z_Valid="true" gantry_clips_removed="true" Temperature="213.5205" Fan="0"><LastKnownExtruderLocation X="-1000" Y="-1000" Z="-1000" E="-1000" /></Extruder><Hardware PORT="/dev/tty.usbmodem1421" MACHINE_TYPE="The_Micro" firmware_version="2016012501" bootloader_version="0" hours_used="1.1" LastResetCauseMask="32" firmware_name="Micro3D" firmware_url="unknown" protocol_version="unknown" extruder_count="1" repetier_protocol="2" /><Calibration Calibration_Valid="true" G32_VERSION="1" CORNER_HEIGHT_BACK_RIGHT="0.0988273" CORNER_HEIGHT_BACK_LEFT="0.2928073" CORNER_HEIGHT_FRONT_LEFT="-0.5003253" CORNER_HEIGHT_FRONT_RIGHT="-1.28456163" CORNER_HEIGHT_BACK_RIGHT_OFFSET="0" CORNER_HEIGHT_BACK_LEFT_OFFSET="1" CORNER_HEIGHT_FRONT_LEFT_OFFSET="2" CORNER_HEIGHT_FRONT_RIGHT_OFFSET="3" ENTIRE_Z_HEIGHT_OFFSET="4" BACKLASH_X="0.322101861" BACKLASH_Y="0.7756652" BACKLASH_SPEED="1500" /><Logging Waits="false" Feedback="false" /></PrinterInfo></SocketBroadcast><EOF>';

  function getInfoObj() {
    return { serialnumber: 'BL-12-34-56-78-100-200',
      printerStatus: 'Firmware_Printing',
      filamentInfo: { temperature: '215', type: 'PLA', location: 'External' },
      extruder:
      { homed: 'false',
        inRelativeMode: 'true',
        zValid: 'true',
        gantryClips: 'true',
        temperature: '213.5205',
        fan: '0',
        lastKnownExtruderLocation: { x: '-1000', y: '-1000', z: '-1000', e: '-1000' } },
      hardware:
      { port: '/dev/tty.usbmodem1421',
        machineType: 'The_Micro',
        firmwareVersion: '2016012501',
        bootloaderVersion: '0',
        hoursUsed: '1.1',
        lastResetCauseMask: '32',
        firmwareName: 'Micro3D',
        firmwareUrl: 'unknown',
        protocolVersion: 'unknown',
        extrudercount: '1',
        repetierProtocol: '2' },
      calibration:
      { calibrationValid: 'true',
        g32Version: '1',
        cornerHeightBackRight: '0.0988273',
        cornerHeightBackLeft: '0.2928073',
        cornerHeightFrontLeft: '-0.5003253',
        cornerHeightFrontRight: '-1.28456163',
        cornerHeightBackRightOffset: '0',
        cornerHeightBackLeftOffset: '1',
        cornerHeightFrontLeftOffset: '2',
        cornerHeightFrontRightOffset: '3',
        entireZHeightOffset: '4',
        backlashX: '0.322101861',
        backlashY: '0.7756652',
        backlashSpeed: '1500' },
      currentJob:
      { jobName: 'test job',
        user: 'test user',
        percentComplete: '0.25813365',
        previewImageFilename: 'null',
        status: 'Printing' },
      logging: { waits: 'false', feedback: 'false' } };
  }
});