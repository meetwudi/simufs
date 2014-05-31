var parseCommand = require('../util/cli').parseCommand,
  report = require('../util/cli').report,
  core = require('./core');

function process(command) {
  command = parseCommand(command);
  switch (command.cmd) {
    case 'pwd':
      report(core.getCurrentPath());
      break;
    default:
      report('命令解析出错，请检查命令格式是否正确');
      break;
  }
}

module.exports = process;