import { config } from '../config/config.js';

// 이미지 URL 생성 헬퍼
const getImageUrl = (filename) => {
    return `http://${config.server.host}:${config.server.port}/images/${encodeURIComponent(
        filename,
    )}`;
};

// 이미지 URL 상수
export const IMAGE_URLS = {
    FEPNS_MAIN: getImageUrl('FEPNS img.png'),
    FEPNS_DEV: getImageUrl('fepns img(dev).png'),
};
