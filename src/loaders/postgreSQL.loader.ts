const Pool = require('pg').Pool
export default async () => {
    const pool = new Pool({
        user: 'room',
        host: 'localhost',
        database: 'test123',
        password: 'admin123',
        port: 53162,
    })
return pool.connection;
};