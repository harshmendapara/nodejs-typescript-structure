import config from './config/config';
import express from 'express';
import Logger from './loaders/logger.loader';
import http from 'http';

let server: any;
let port: any;

const normalizePort = (val: any) => {
    const port = parseInt(val, 10);
    console.log(port)
    if (isNaN(port)) {
        return val;
    }

    if (port >= 0) {
        return port;
    }
    return false;
}
const onListening = () => {
    console.log('Inside listening');
    const addr = server.address();
    const bind = typeof addr === 'string' ? `pipe  ${addr}` : `port-${port}`;
    console.log(`
        ################################################
        🛡️  Server listening on  ${bind} port-${port} 🛡️ 
        ################################################
      `);
};

async function startServer() {
    const app = express();
    port = normalizePort(config.port);
    app.set('port', port);
    server = http.createServer(app);
    server.listen(port);
    await require('./loaders/index.loader').default({ expressApp: app });
    server.on('error', onError);
    server.on('listening', onListening);
}

startServer();

const onError = (error: any) => {
    const addr = server.address();
    if (error.syscall !== 'listen') {
        throw error;
    }
    const bind = typeof addr === 'string' ? `pipe  ${addr}` : `port   ${port}`;
    switch (error.code) {
        case 'EACCESS':
            Logger.info(`${bind} requires elevated privileges`);
            process.exit(1);
            break;
        case 'EADDRINUSE':
            Logger.info(`${bind} is already in use`);
            process.exit(1);
            break;
        default:
            throw error;
    }
};
