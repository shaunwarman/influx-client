const Http = require('http');
const QS = require('querystring');

class InfluxClient {
  constructor(options = {}) {
    const {host, port, db} = options;

    this.db = db || 'mydb';
    this.host = host || '127.0.0.1';
    this.port = port || 8086;
  }

  setup(msg) {
    return {
      hostname: this.host,
      port: this.port,
      path: `/write?db=${this.db}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(msg)
      }
    };
  }

  write(url, data, callback) {
    const point = this._format(data);
    const options = this.setup(point);

    const req = Http.request(options, (res) => {
      let response = null;
      res.setEncoding('utf8');
      res.on('data', (chunk) => {
        response += chunk;
      });
      res.on('end', () => {
        callback(null, response);
      });
    });

    req.on('error', (e) => {
      return callback(e);
    });

    req.write(point);
    req.end();
  }

  _format(data) {
    let values = '';

    Object.keys(data).forEach((key, index) => {
      if (index === 0) {
        values += `${key}="${data[key]}"`;
      } else {
        values += `,${key}="${data[key]}"`;
      }
    });

    return `event ${values} ${Date.now()} \n`;
  }
}

module.exports = InfluxClient;
