require('dotenv').config();

const server = require('./server');
const port = __config.server.port;

server.listen(port, () => console.log(`API server started on ${port}`));
