import fs from 'fs';  // fs 모듈을 가져옵니다.
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';

// __dirname 대체 구현
const __filename = fileURLToPath(import.meta.url); // 현재 파일 경로
const __dirname = dirname(__filename); // 현재 디렉토리 경로

