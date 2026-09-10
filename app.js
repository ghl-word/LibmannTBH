const http = require('http');
const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end('Vitoria! O GitHub Actions fez o deploy na AWS com sucesso!');
});
server.listen(3000, () => console.log('Servidor rodando na porta 3000')); 
