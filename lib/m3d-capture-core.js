'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _xml2js = require('xml2js');

var _xml2js2 = _interopRequireDefault(_xml2js);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var parseString = _xml2js2.default.parseString;

var M3DCore = function () {
  function M3DCore() {
    _classCallCheck(this, M3DCore);
  }

  _createClass(M3DCore, [{
    key: 'toObj',
    value: function toObj(statusXmlStr) {
      return new Promise(function (resolve, reject) {
        parseString(statusXmlStr, function (err, result) {
          if (err) {
            reject(err);
          }

          var lg = result.SocketBroadcast.PrinterInfo[0].Logging[0]['$'];
          var logging = { waits: lg.Waits, feedback: lg.Feedback };

          var currentJob = null;
          if (result.SocketBroadcast.PrinterInfo[0].hasOwnProperty('CurrentJob')) {
            var cj = result.SocketBroadcast.PrinterInfo[0].CurrentJob[0]['$'];
            currentJob = {
              jobName: cj.JobName,
              user: cj.User,
              percentComplete: cj.PercentComplete,
              previewImageFilename: cj.PreviewImageFileName,
              status: cj.Status
            };
          }

          var cb = result.SocketBroadcast.PrinterInfo[0].Calibration[0]['$'];
          var calibration = {
            calibrationValid: cb.Calibration_Valid,
            g32Version: cb.G32_VERSION,
            cornerHeightBackRight: cb.CORNER_HEIGHT_BACK_RIGHT,
            cornerHeightBackLeft: cb.CORNER_HEIGHT_BACK_LEFT,
            cornerHeightFrontLeft: cb.CORNER_HEIGHT_FRONT_LEFT,
            cornerHeightFrontRight: cb.CORNER_HEIGHT_FRONT_RIGHT,
            cornerHeightBackRightOffset: cb.CORNER_HEIGHT_BACK_RIGHT_OFFSET,
            cornerHeightBackLeftOffset: cb.CORNER_HEIGHT_BACK_LEFT_OFFSET,
            cornerHeightFrontLeftOffset: cb.CORNER_HEIGHT_FRONT_LEFT_OFFSET,
            cornerHeightFrontRightOffset: cb.CORNER_HEIGHT_FRONT_RIGHT_OFFSET,
            entireZHeightOffset: cb.ENTIRE_Z_HEIGHT_OFFSET,
            backlashX: cb.BACKLASH_X,
            backlashY: cb.BACKLASH_Y,
            backlashSpeed: cb.BACKLASH_SPEED
          };

          var hw = result.SocketBroadcast.PrinterInfo[0].Hardware[0]['$'];
          var hardware = {
            port: hw.PORT,
            machineType: hw.MACHINE_TYPE,
            firmwareVersion: hw.firmware_version,
            bootloaderVersion: hw.bootloader_version,
            hoursUsed: hw.hours_used,
            lastResetCauseMask: hw.LastResetCauseMask,
            firmwareName: hw.firmware_name,
            firmwareUrl: hw.firmware_url,
            protocolVersion: hw.protocol_version,
            extrudercount: hw.extruder_count,
            repetierProtocol: hw.repetier_protocol
          };

          var lkel = result.SocketBroadcast.PrinterInfo[0].Extruder[0].LastKnownExtruderLocation[0]['$'];
          var lastKnownExtruderLocation = { x: lkel.X, y: lkel.Y, z: lkel.Z, e: lkel.E };

          var ex = result.SocketBroadcast.PrinterInfo[0].Extruder[0]['$'];
          var extruder = {
            homed: ex.Homed,
            inRelativeMode: ex.InRelativeMode,
            zValid: ex.Z_Valid,
            gantryClips: ex.gantry_clips_removed,
            temperature: ex.Temperature,
            fan: ex.Fan,
            lastKnownExtruderLocation: lastKnownExtruderLocation
          };

          var fi = result.SocketBroadcast.PrinterInfo[0].FilamentInfo[0]['$'];
          var filamentInfo = { temperature: fi.Temperature, type: fi.Type, location: fi.Location };

          var pi = result.SocketBroadcast.PrinterInfo[0]['$'];
          var printerInfo = { serialnumber: pi.Serialnumber, printerStatus: pi.PrinterStatus };
          printerInfo.filamentInfo = filamentInfo;
          printerInfo.extruder = extruder;
          printerInfo.hardware = hardware;
          printerInfo.calibration = calibration;
          if (currentJob) {
            printerInfo.currentJob = currentJob;
          }
          printerInfo.logging = logging;

          resolve(printerInfo);
        });
      });
    }
  }]);

  return M3DCore;
}();

exports.default = new M3DCore();