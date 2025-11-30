import pools from './database.js';

const testDbConnection = async (pool, dbName) => {
    if (!pool) {
        console.warn(`⚠️  ${dbName} DB Pool이 없어 테스트를 건너뜁니다.`);
        return false;
    }

    try {
        const [rows] = await pool.query('SELECT 1 + 1 AS solution');
        console.log(`${dbName} DB 테스트 쿼리 결과:`, rows[0].solution);
        return true;
    } catch (err) {
        console.error(`${dbName} DB 테스트 쿼리 실행 중 오류 발생:`, err);
        return false;
    }
};

const testAllConnections = async () => {
    await testDbConnection(pools.fepns, 'fepns');
};

export { testDbConnection, testAllConnections };
