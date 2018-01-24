#!/usr/bin/env nodejs

var SerialPort = require('serialport');
var sunseed_parser = require('sunseed-parser');

var port = new SerialPort('/dev/ttyMFD1', {
        baudRate: 115200,
        parity: 'odd',
        parser: SerialPort.parsers.readline('\n')
});

port.on('data', function (data) {
  console.log(data.toString('hex'));
  sunseed_parser.pmc(data, function (err, parsed_data) {
    if (err) {
      console.log(err);
      process.exit();
    }
    else {
      console.log(parsed_data);
      console.log("---------------");
    }
  });
});
