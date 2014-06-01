function report(message) {
  process.stdout.write('- ' + message.replace(/\n/g, '\n  ') + '\n');
}

function _trim(str) {
  return str.replace(/^\s+/, '').replace(/\s+$/, '')
    .replace(/^\"/, '').replace(/\"$/, '');
}

function parseCommand(command) {
  var parts = /^\s*([A-Za-z]+)\(([^\(\)]*)\)\s*$/.exec(command);
  if (!parts) {
    return null;
  }
  return {
    cmd: _trim(parts[1]),
    args: parts[2].split(/\"\s*,\s*\"/).map(function(val) { return _trim(val); })
  };
}

module.exports = {
  report: report,
  parseCommand: parseCommand
};