'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _events = require('events');

var _pcap = require('pcap2');

var _pcap2 = _interopRequireDefault(_pcap);

var _m3dCaptureCore = require('./m3d-capture-core');

var _m3dCaptureCore2 = _interopRequireDefault(_m3dCaptureCore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var M3DCapture = function (_EventEmitter) {
  _inherits(M3DCapture, _EventEmitter);

  function M3DCapture() {
    _classCallCheck(this, M3DCapture);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(M3DCapture).call(this));

    _this.lastObj = null;

    _this.EVENT_JOB_START = 'job start';
    _this.EVENT_JOB_FINISH = 'job finish';
    _this.EVENT_JOB_CHANGE_STATUS = 'job change-status';
    _this.EVENT_DATA_RECEIVE = 'data recv';
    _this.EVENT_PRINTER_CHANGE_STATUS = 'printer change-status';
    return _this;
  }

  _createClass(M3DCapture, [{
    key: 'run',
    value: function run(interfaceName) {
      var _this2 = this;

      var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      var tcpTracker = new _pcap2.default.TCPTracker();
      var pcapSession = new _pcap2.default.Session(interfaceName, options);

      tcpTracker.on('session', function (session) {
        session.on('data recv', function (session, data) {
          _this2._onReceivedData(data);
        });
      });

      pcapSession.on('packet', function (rawPacket) {
        var packet = _pcap2.default.decode.packet(rawPacket);
        tcpTracker.track_packet(packet);
      });
    }
  }, {
    key: '_onReceivedData',
    value: function _onReceivedData(data) {
      var _this3 = this;

      _m3dCaptureCore2.default.toObj(data).then(function (obj) {
        if (!_this3.lastObj) {
          _this3.lastObj = obj;
        }

        if (!_this3.lastObj.hasOwnProperty('currentJob') && obj.hasOwnProperty('currentJob')) {
          _this3.emit(_this3.EVENT_JOB_START, obj);
        }

        if (_this3.lastObj.hasOwnProperty('currentJob') && !obj.hasOwnProperty('currentJob')) {
          _this3.emit(_this3.EVENT_JOB_FINISH, obj);
        }

        var lastJobStatus = extractJobStatus(_this3.lastObj);
        var currentJobStatus = extractJobStatus(obj);
        if (lastJobStatus !== currentJobStatus) {
          _this3.emit(_this3.EVENT_JOB_CHANGE_STATUS, currentJobStatus, lastJobStatus, obj);
        }

        var lastPrinterStatus = extractPrinterStatus(_this3.lastObj);
        var currentPrinterStatus = extractPrinterStatus(obj);
        if (lastPrinterStatus !== currentPrinterStatus) {
          _this3.emit(_this3.EVENT_PRINTER_CHANGE_STATUS, currentPrinterStatus, lastPrinterStatus, obj);
        }

        _this3.emit(_this3.EVENT_DATA_RECEIVE, obj);
        _this3.lastObj = obj;
      });
    }
  }]);

  return M3DCapture;
}(_events.EventEmitter);

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

exports.default = new M3DCapture();