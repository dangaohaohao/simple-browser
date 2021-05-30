const http = require('http');

const HOST = '127.0.0.1';
const PORT = 8088;

// 创建 HTTP 服务器。
const server = http.createServer((req, res) => {
  console.log('接收的req headers', req.headers);
  res.setHeader('auth-token', 'xuanuxan')
  res.writeHead(200, { 'Content-Type': 'text/pain; charset="utf-8"' });
  res.end('响应内容 ok');
});

// 服务器正在运行。
server.listen(PORT, HOST, () => {
    console.log(`成功启动服务器, 可通过 http://${HOST}:${PORT} 查看`);
});