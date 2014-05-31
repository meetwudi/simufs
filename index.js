var cli = require('./sys/cli'),
  core = require('./sys/core');

core.init(function() {
  startPrompt();
});

function startPrompt() {
  process.stdout.write("> ");
  process.stdin.on('data', function(data) {
    cli((data.slice(0, data.length - 1)).toString());
    process.nextTick(function() {
      process.stdout.write("> ");
    });
  });
}