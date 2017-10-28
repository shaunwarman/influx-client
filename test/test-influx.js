const Client = require('..');

const Test = require('tape');

Test('influxdb', t => {
  let client;

  t.test('setup', t => {
    client = new Client({
      host: '127.0.0.1',
      port: 8086,
      db: 'mydb',
      username: 'admin',
      password: 'admin'
    });

    t.ok(typeof client, 'object');
    t.end();
  });

  t.test('write', t => {
    client.write({ some: 'data' }, (err, res) => {
      t.ok(!err, 'error must be undefined');
      t.ok(typeof res, 'object');
      t.end();
    });
  });

});
