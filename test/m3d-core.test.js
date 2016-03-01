import assert from 'power-assert';
import sinon from 'sinon';

import core from '../src/m3d-core';

describe('M3DCore', () => {
  describe('toObj', () => {
    context('when info xml has job status', () => {
      it('should get info obj with job status', () => {
        var xmlStr = printingXmlStr;
        core.toObj(xmlStr)
          .then((obj) => {
            assert(obj.currentJob.jobName === 'test job');
            assert(obj.currentJob.user === 'test user');
          });
      });
    });
    context('when info xml dosen\'t have job status', () => {
      it ('should get info obj without job status', () => {
        var xmlStr = nonPrintingXmlStr;
        core.toObj(xmlStr)
          .then((obj) => {
            assert(!obj.hasOwnProperty('currentStatus'));
          });
      });
    });
    context('when info xml is broken', () => {
      it ('should reject error', () => {
        var xmlStr = '{"json": true}';
        core.toObj(xmlStr)
          .catch((err) => {
            assert(err.name === 'Error');
          });
      });
    });
  });

  describe('onReceivedData', () => {
    context('when job is started', () => {
        before(() => {
          var o = getInfoObj();
          delete o.currentJob
          core.lastObj = o;
        })
        it('should emit start event', (done) => {
          var errTimeout = setTimeout(() => {
            assert(false, 'Event never fired');
            done();
          }, 500);

          core.on('job start', (obj) => {
            clearTimeout(errTimeout);
            assert(true);
            done();
          });
          core.onReceivedData(printingXmlStr);
        });
    });
    context('when job is finished', () => {
      before(() => {
        var o = getInfoObj();
        core.lastObj = o;
      })
      it('should emit finish event', (done) => {
        var errTimeout = setTimeout(() => {
          assert(false, 'Event never fired');
          done();
        }, 500);

        core.on('job finish', (obj) => {
          clearTimeout(errTimeout);
          assert(true);
          done();
        });
        core.onReceivedData(nonPrintingXmlStr);
      });
    });
    context('when job status is changed', () => {
      before(() => {
        var o = getInfoObj();
        o.currentJob.status = "beforeTest";
        core.lastObj = o;
        core.lastJobStatus = "beforeTest";
      })
      it('should emit status changed event', (done) => {
        var errTimeout = setTimeout(() => {
          assert(false, 'Event never fired');
          done();
        }, 500);

        core.on('job change-status', (newStatus, oldStatus, obj) => {
          clearTimeout(errTimeout);
          assert(newStatus === 'Printing');
          assert(oldStatus === 'beforeTest');
          done();
        });
        core.onReceivedData(printingXmlStr);
      });
    });
    context('when received data', () => {
      it('should emit data recv event', (done) => {
        var errTimeout = setTimeout(() => {
          assert(false, 'Event never fired');
          done();
        }, 500);

        core.on('data recv', (obj) => {
          clearTimeout(errTimeout);
          assert(true);
          done();
        });
        core.onReceivedData(printingXmlStr);
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