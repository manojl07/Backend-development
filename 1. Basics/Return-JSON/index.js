const http = require('http');

const server = http.createServer((req, res) => {

  if (req.url === '/api/users') {
    const users = [
      { id: 1, name: 'Manoj' },
      { id: 2, name: 'Rahul' }
    ]

    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(users));
  }
})

server.listen(3000);