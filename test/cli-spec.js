var util = require('../util/cli.js');

describe('CLI', function() {
  it('should parse command correctly', function() {
    var command = 'write("myfile.ext", "Hello, world!")';
    var result = util.parseCommand(command);
    result.should.be.ok;
    result.should.have.keys(['cmd', 'args']);
    result.cmd.should.eql('write');
    result.args.should.eql(['myfile.ext', 'Hello, world!']);
  });
});