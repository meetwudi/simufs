function report(message) {
  console.log('- ' + message.replace(/\n/g, '\n  '));
}

module.exports = {
  report: report
};