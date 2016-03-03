import assert from 'power-assert';
import sinon from 'sinon';

import core from '../src/m3d-capture-core';

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

  var printingXmlStr = '<SocketBroadcast><SPOOLER__ALL/><PrinterInfo Serialnumber="BL-12-34-56-78-100-200" PrinterStatus="Firmware_Printing"><FilamentInfo Temperature="215" Color="CrystalClear" Type="PLA" Code="ERR" Location="External" /><Extruder Homed="false" InRelativeMode="true" Z_Valid="true" gantry_clips_removed="true" Temperature="213.5205" Fan="0"><LastKnownExtruderLocation X="-1000" Y="-1000" Z="-1000" E="-1000" /></Extruder><Hardware PORT="/dev/tty.usbmodem1421" MACHINE_TYPE="The_Micro" firmware_version="2016012501" bootloader_version="0" hours_used="1.1" LastResetCauseMask="32" firmware_name="Micro3D" firmware_url="unknown" protocol_version="unknown" extruder_count="1" repetier_protocol="2" /><Calibration Calibration_Valid="true" G32_VERSION="1" CORNER_HEIGHT_BACK_RIGHT="0.0988273" CORNER_HEIGHT_BACK_LEFT="0.2928073" CORNER_HEIGHT_FRONT_LEFT="-0.5003253" CORNER_HEIGHT_FRONT_RIGHT="-1.28456163" CORNER_HEIGHT_BACK_RIGHT_OFFSET="0" CORNER_HEIGHT_BACK_LEFT_OFFSET="1" CORNER_HEIGHT_FRONT_LEFT_OFFSET="2" CORNER_HEIGHT_FRONT_RIGHT_OFFSET="3" ENTIRE_Z_HEIGHT_OFFSET="4" BACKLASH_X="0.322101861" BACKLASH_Y="0.7756652" BACKLASH_SPEED="1500" /><CurrentJob JobName="test job" User="test user" PercentComplete="0.25813365" PreviewImageFileName="null" Status="Printing" /><Logging Waits="false" Feedback="false" /></PrinterInfo></SocketBroadcast><EOF>';
  var nonPrintingXmlStr = '<SocketBroadcast><SPOOLER__ALL/><PrinterInfo Serialnumber="BL-12-34-56-78-100-200" PrinterStatus="Firmware_Printing"><FilamentInfo Temperature="215" Color="CrystalClear" Type="PLA" Code="ERR" Location="External" /><Extruder Homed="false" InRelativeMode="true" Z_Valid="true" gantry_clips_removed="true" Temperature="213.5205" Fan="0"><LastKnownExtruderLocation X="-1000" Y="-1000" Z="-1000" E="-1000" /></Extruder><Hardware PORT="/dev/tty.usbmodem1421" MACHINE_TYPE="The_Micro" firmware_version="2016012501" bootloader_version="0" hours_used="1.1" LastResetCauseMask="32" firmware_name="Micro3D" firmware_url="unknown" protocol_version="unknown" extruder_count="1" repetier_protocol="2" /><Calibration Calibration_Valid="true" G32_VERSION="1" CORNER_HEIGHT_BACK_RIGHT="0.0988273" CORNER_HEIGHT_BACK_LEFT="0.2928073" CORNER_HEIGHT_FRONT_LEFT="-0.5003253" CORNER_HEIGHT_FRONT_RIGHT="-1.28456163" CORNER_HEIGHT_BACK_RIGHT_OFFSET="0" CORNER_HEIGHT_BACK_LEFT_OFFSET="1" CORNER_HEIGHT_FRONT_LEFT_OFFSET="2" CORNER_HEIGHT_FRONT_RIGHT_OFFSET="3" ENTIRE_Z_HEIGHT_OFFSET="4" BACKLASH_X="0.322101861" BACKLASH_Y="0.7756652" BACKLASH_SPEED="1500" /><Logging Waits="false" Feedback="false" /></PrinterInfo></SocketBroadcast><EOF>';

});