import { setupWorker } from 'msw/browser';
import { handlers } from './mocks';

/**
 * 브라우저 환경에서 MSW 서비스 워커를 설정합니다.
 */
export const worker = setupWorker(...handlers); 