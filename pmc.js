var fs = require('fs');
var zerorpc = require("zerorpc");
var SerialPort = require('serialport');
var sunseed_parser = require('sunseed-parser');

var toggle_file = '/var/pmc/toggle';
var toggle = fs.readFileSync(toggle_file, 'utf8');
var counter = 0;

fs.readFile('/etc/machine-id', function (err, file_data) {
  if (err) {
    return console.log(err);
  }
  var machine_id = file_data.toString().slice(0, -1);
  var topic = "pmc/" + machine_id;

  var client = new zerorpc.Client();
  client.connect("tcp://127.0.0.1:4242");

  var port = new SerialPort('/dev/ttyMFD1', {
    baudRate: 115200,
    parity: 'odd',
    parser: SerialPort.parsers.readline('\n')
  });

  port.on('data', function (serial_data) {
    counter++;
    sunseed_parser.pmc(serial_data, function (err, parsed_data) {
      if (err) {
        console.log(err + " Data: " + serial_data);
      }
      else {
        if (counter > 10) {
          client.invoke("setData", JSON.stringify(JSON.parse(parsed_data).splice(3, 3)), function(error, res, more) {
            console.log(""+res);
          });
          counter = 0;
        }
      }
    });
  });
});
