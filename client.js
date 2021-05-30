// 主要是需要实现 Request 和 Response

const net = require('net');

// 试试 net demo
// const client = net.createConnection({ port: 8088 }, () => {
//   // 'connect' 监听器
//   console.log('已连接到服务器');
//  //   client.write('你好世界!\r\n');
//  const requestLine = 'GET /HTTP/1.1';
//  const requestHeader = 'Content-Type: application/json';
//  const requestBody = '你好世界'
//  client.write(`${requestLine}\r\n${requestHeader}\r\n\r\n${requestBody}`);
// });
// client.on('data', (data) => {
//   console.log(data.toString());
//   client.end();
// });
// client.on('end', () => {
//   console.log('已从服务器断开');
// });

// 请求行(包括请求方法 请求路径 请求协议)
// 请求头(请求头字段如 Content-Type 等, 也可以自定义请求头)
// 请求体(请求体, 如 POST 请求的请求参数)
class Request {
    // method, url = host + port + path
    // headers
    // body
    constructor(options) {
        this.method = options.method || 'GET';
        this.host = options.host || 'localhost';
        this.port = options.port || '80';
        this.path = options.path || '/';
        this.body = options.body || {};
        this.headers = options.headers || {};
        if(!this.headers['Content-Type']) {
            this.headers['Content-Type'] = 'application/x-www-url-encoded';
        }
        if(this.headers['Content-Type'] === 'application/json') {
            this.bodyText = JSON.stringify(this.body);
        }else if(this.headers['Content-Type'] === 'application/x-www-url-encoded') {
            this.bodyText = Object.keys(this.body).map(key => `${key}:${encodeURIComponent(this.body[key])}`).join('&')
        }
        this.headers['Content-Length'] = this.bodyText.length;
    }
    
    toString() {
        const requestLine = `${this.method} ${this.path} HTTP/1.1`;
        const requestHeader = `${Object.keys(this.headers).map(key => `${key}: ${this.headers[key]}`).join('\r\n')}`;
        const requestBody = `${this.bodyText}`;
        return `${requestLine}\r\n${requestHeader}\r\n\r\n${requestBody}`;
    }

    send(connection) {
        return new Promise((resolve, reject) => {
            if(connection) {
                connection.write(this.toString());
            }else {
                connection = net.createConnection({ host: this.host, port: this.port }, () => {
                    console.log('已连接到服务器');
                    connection.write(this.toString());
                  });
              }

              connection.on('data', (data) => {
                resolve(data.toString());
                connection.end();
              });

              connection.on('end', () => {
                console.log('已从服务器断开');
              });
              
              connection.on('error', (err) => {
                  console.log('发生了错误', err);
                  reject(new Error(err));
              })
        });
    }
}

class Response {}

class ResponseParse {}

(async function () {
    let request = new Request({
        method: 'POST',
        host: '127.0.0.1',
        port: '8088',
        path: '/test',
        body: {
            name: 'xuan'
        },
        headers: {
            'Content-Type': 'application/json'
        }
    });
    
    const response = await request.send();

    console.log('收到的响应', response);
})();

