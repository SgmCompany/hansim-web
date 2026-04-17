#!/usr/bin/env node

/**
 * 백엔드 서버 상태 확인 후 OpenAPI 스펙 동기화
 */

const http = require('http');
const { exec } = require('child_process');

const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
const OPENAPI_ENDPOINT = `${BACKEND_URL}/v3/api-docs`;

function checkBackendServer() {
  return new Promise((resolve) => {
    const url = new URL(OPENAPI_ENDPOINT);
    
    const req = http.get({
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      timeout: 2000,
    }, (res) => {
      resolve(res.statusCode === 200);
    });

    req.on('error', () => resolve(false));
    req.on('timeout', () => {
      req.destroy();
      resolve(false);
    });
  });
}

async function syncApiSpec() {
  console.log('🔍 백엔드 서버 확인 중...');
  
  const isServerRunning = await checkBackendServer();
  
  if (isServerRunning) {
    console.log('✅ 백엔드 서버 감지됨. API 스펙 동기화 시작...');
    
    exec('npm run sync:api', (error, stdout, stderr) => {
      if (error) {
        console.error('❌ API 스펙 동기화 실패:', error.message);
        return;
      }
      if (stderr && !stderr.includes('% Total')) {
        console.error('⚠️  경고:', stderr);
      }
      console.log('✅ API 스펙 동기화 완료!');
      console.log(stdout);
    });
  } else {
    console.log('⚠️  백엔드 서버가 실행되지 않음. API 스펙 동기화 건너뜀.');
    console.log(`   서버 확인: ${OPENAPI_ENDPOINT}`);
  }
}

syncApiSpec();
