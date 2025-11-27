import mysql from 'mysql2/promise';
import { config } from '../config/config.js';

let fepnsPool = null;

// DB 설정이 있으면 pool 생성
if (config.db.host && config.db.user && config.db.password && config.db.database) {
    fepnsPool = mysql.createPool({
        host: config.db.host,
        port: config.db.port || 3306,
        user: config.db.user,
        password: config.db.password,
        database: config.db.database,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        enableKeepAlive: true,
        keepAliveInitialDelay: 0,
        connectTimeout: 10000,
    });
} else {
    console.warn('⚠️  DB 설정이 없어 Pool을 생성하지 않습니다.');
}

const pools = {
    fepns: fepnsPool,
};

export default pools;
