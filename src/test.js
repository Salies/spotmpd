var mpd = require('./mpd.js'),
    cmd = mpd.cmd
var client = mpd.connect({
  port: 6600,
  host: 'localhost',
});

var file = "02. The Theory of Everything, Part 1.wav";
var file2 = "03. Patterns.wav"

client.on('ready', function() {
  console.log("ready");
  client.sendCommand(cmd("status", []), function(err, msg) {
    if (err) throw err;
    console.log(msg);
  });

  /*client.sendCommand(cmd(`update`, []), function(err, msg) {
    if (err) throw err;
    console.log(msg);
  });*/

  //mpc insert "file:///data/incoming/files/111_scorpions_-_the_zoo.mp3"
  client.sendCommand(cmd(`add "${file}"`, []), function(err, msg) {
    if (err) throw err;
    console.log(msg);
  });

  client.sendCommand(cmd(`add "${file2}"`, []), function(err, msg) {
    if (err) throw err;
    console.log(msg);
  });

  client.sendCommand(cmd(`play`, []), function(err, msg) {
    if (err) throw err;
    console.log(msg);
  });
});
