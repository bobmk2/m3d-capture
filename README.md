## m3d-capture [![npm version](https://badge.fury.io/js/m3d-capture.svg)](https://badge.fury.io/js/m3d-capture)

m3d-capture supports you to capture packets from [micro 3d printer](https://printm3d.com/).

### Dependency

[pcap2](https://www.npmjs.com/package/pcap2) : Used for capturing packets

### Intro

```bash
# Install
$ npm install --save-dev m3d-capture
```

### Sample

```javascript
import m3dcap from './m3d-capture';

m3dcap.on(m3dcap.EVENT_DATA_RECEIVE, (obj) => {
    console.log(`# data recv serialnumber:${obj.serialnumber}`)
});

m3dcap.on(m3dcap.EVENT_JOB_START, (obj) => {
    console.log('# started job')
});

m3dcap.on(m3dcap.EVENT_JOB_CHANGE_STATUS, (newStatus, oldStatus, obj) => {
    console.log(`# changed job status ${oldStatus} => ${newStatus}`);
});

m3dcap.on(m3dcap.EVENT_JOB_FINISH, (obj) => {
    console.log('# finished job')
});

m3dcap.on(m3dcap.EVENT_PRINTER_CHANGE_STATUS, (newStatus, oldStatus, obj) => {
    console.log(`# changed printer status ${oldStatus} => ${newStatus}`);
});

m3dcap.run('lo0', {})
```

### Tips

#### Printer status transition
`Idle` > `Ready` > `Idle` > `Printing` > `Ready` > `Executing` > `Idle` > `Executing`

#### Job status transition
`Nothing` => `Queued` => `Heating` <=> `Printing` => `Nothing`

### License

[MIT](http://opensource.org/licenses/MIT)