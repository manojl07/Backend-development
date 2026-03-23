const http = require('http');

const server = http.createServer((req, res) => {
  res.write('My first Node Server');
  res.end();
});

server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
  
})