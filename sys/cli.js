var parseCommand = require('../util/cli').parseCommand,
  report = require('../util/cli').report,
  core = require('./core');

function process(command) {
  command = parseCommand(command);
  switch (command.cmd) {
    case 'pwd':
      report(core.getCurrentPath());
      break;
    case 'create':
      core.createFile(command.args[0]);
      break;
    case 'ls':
      report(core.listFiles());
      break;
    case 'exit':
      core.exit();
      break;
    case 'read':
      report(core.readFile(command.args[0]));
      break;
    case 'write':
      core.writeFileByName(command.args[0], command.args[1]);
      break;
    case 'unlink':
      core.unlinkFile(command.args[0]);
      break;
    case 'mkdir':
      core.createDir(command.args[0]);
      break;
    case 'cd':
      core.enterDir(command.args[0]);
      break;
    case 'goback':
      core.leaveDir();
      break;
    case 'info':
      report(core.getFileInfo(command.args[0]));
      break;
    default:
      report('命令解析出错，请检查命令格式是否正确');
      break;
  }
}

module.exports = process;