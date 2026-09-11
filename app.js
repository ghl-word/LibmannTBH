const http = require('http');
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end('<h1>Vitoria! O GitHub Actions fez o deploy na AWS com sucesso! ✅</h1>');
});
server.listen(3000, '0.0.0.0', () => console.log('Servidor rodando na porta 3000'));
