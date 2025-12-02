import fs from 'fs';
import path from 'path';
import pools from '../database.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const executeSqlFile = async (pool, filePath) => {
    if (!fs.existsSync(filePath)) {
        throw new Error(`SQL 파일을 찾을 수 없습니다: ${filePath}`);
    }

    const sql = fs.readFileSync(filePath, 'utf8');
    const queries = sql
        .split(';')
        .map((query) => query.trim())
        .filter((query) => query.length > 0);

    for (const query of queries) {
        if (query.length > 0) {
            await pool.query(query);
        }
    }
};

const createSchemas = async () => {
    if (!pools.fepns) {
        throw new Error('DB Pool이 없습니다. DB 설정을 확인해주세요.');
    }

    const sqlDir = path.join(__dirname, '../sql');
    try {
        await executeSqlFile(pools.fepns, path.join(sqlDir, 'config.sql'));
        await executeSqlFile(pools.fepns, path.join(sqlDir, 'users.sql'));
        await executeSqlFile(pools.fepns, path.join(sqlDir, 'events.sql'));
        await executeSqlFile(pools.fepns, path.join(sqlDir, 'relations.sql'));
        await executeSqlFile(pools.fepns, path.join(sqlDir, 'notifications.sql'));
        await executeSqlFile(pools.fepns, path.join(sqlDir, 'money_logs.sql'));
        console.log('✅ 데이터베이스 테이블이 성공적으로 생성되었습니다.');
    } catch (err) {
        console.error('❌ 데이터베이스 테이블 생성 중 오류가 발생했습니다:', err.message);
        throw err;
    }
};

createSchemas()
    .then(() => {
        console.log('마이그레이션이 완료되었습니다.');
        process.exit(0);
    })
    .catch((error) => {
        console.error('마이그레이션 중 오류가 발생했습니다:', error);
        process.exit(1);
    });
