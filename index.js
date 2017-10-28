const InfluxClient = require('./lib/influx');
const QS = require('querystring');

class Client {
  constructor(options = {}) {
    const {buffer, client, event, host, port, db} = options;

    this.buffer = buffer || 1;
    this.db = db  || 'mydb';
    this.event = event || 'event';
    this.host = host || '127.0.0.1';
    this.port = port || 8086;
    this.writer = new InfluxClient(options);
  }

  getUrl() {
    const qs = {
      db: this.db,
      username: 'admin',
      password: 'admin',
    };

    return `https://${this.host}:${this.port}/write?${QS.stringify(qs)}`;
  }

  read() {}

  write(data, callback) {
    const url = this.getUrl();

    this.writer.write(url, data, callback);
  }
}

module.exports = Client;
