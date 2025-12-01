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
    FEPNS_WEDDING: getImageUrl('wedding.jpg'),
    FEPNS_FUNERAL: getImageUrl('funeral.jpg'),
    FEPNS_FIRST_BIRTHDAY: getImageUrl('firstBirthday.png'),
    FEPNS_BIRTHDAY: getImageUrl('birthday.jpg'),
};

// eventType에 따른 썸네일 URL 반환
export const getEventThumbnail = (eventType) => {
    const thumbnailMap = {
        wedding: IMAGE_URLS.FEPNS_WEDDING,
        funeral: IMAGE_URLS.FEPNS_FUNERAL,
        firstBirthday: IMAGE_URLS.FEPNS_FIRST_BIRTHDAY,
        birthday: IMAGE_URLS.FEPNS_BIRTHDAY,
    };

    return thumbnailMap[eventType] || IMAGE_URLS.FEPNS_MAIN;
};
