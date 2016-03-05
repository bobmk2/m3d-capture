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
import m3dcap from 'm3d-capture';

m3dcap.on(m3dcap.EVENT_DATA_RECEIVE, (obj) => {
    console.log(`# data recv serialnumber:${obj.serialnumber}`)
});

m3dcap.run('lo0', {})
```

### Tips

#### Printer status transition
`Idle` > `Ready` > `Idle` > `Printing` > `Ready` > `Executing` > `Idle` > `Executing` > `Ready` > `Idle`

#### Job status transition
`Nothing` => `Queued` => `Heating` <=> `Printing` => `Nothing`

### Example

* [m3d-monitor](https://github.com/bobmk2/m3d-monitor)

![demo gif](https://cloud.githubusercontent.com/assets/1858949/13546925/d2ec52ec-e2ff-11e5-8a0d-2f8ca52dc523.gif)

### Trouble Shooting

#### npm install error

```bash
npm ERR! socketwatcher@0.3.0 install: `node-gyp rebuild`
```

* Some modules that m3d-capture depends on uses **[node-gyp](https://github.com/nodejs/node-gyp)** for building codes.
* Please check **installation** chapter at [node-gyp's github page](https://github.com/nodejs/node-gyp) and install required apps.

### License

[MIT](http://opensource.org/licenses/MIT)