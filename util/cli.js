function report(message) {
  message.replace(/\n/g, '\n ');
  console.log('- ' + message);
}

module.exports = {
  report: report
};