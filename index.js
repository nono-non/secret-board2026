'use strict';
const http = require('http');
const auth = require('http-auth');
const router = require('./lib/router')//.jsは省略可
const fs = require('node:fs');

fs.writeFileSync('./users.htpasswd',
  process.env.USER_HTPASSWD.replace(/\\n/g, '\n')
);

const basic = auth.basic({
  realm: 'Enter username and password.',
  file: './users.htpasswd'
});
//この部分でauthモジュールがuserを作ってくれてる。おそらくreq.userにuser.htpasswdのadminとかguest1とかが入ってる

const server = http.createServer(basic.check((req, res) => {
  router.route(req, res);
}))
.on('error', e => {
  console.error('Server Error', e);
})
.on('clientError', e => {
  console.error('Client Error', e);
});

const port = process.env.PORT || 8000;
server.listen(port, () => {
  console.info('Listening on ' + port);
});
