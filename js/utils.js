/**
 * 지정된 CSS 선택자로 이미지를 미리 로드합니다.
 * @function
 * @param {string} [selector='img'] - 타겟 이미지를 위한 CSS 선택자.
 * @returns {Promise} - 지정된 모든 이미지가 로드되면 해결되는 Promise.
 */
const preloadImages = (selector = 'img') => {
    return new Promise((resolve) => {
        // imagesLoaded 라이브러리를 사용하여 모든 이미지(배경 포함)가 완전히 로드되었는지 확인합니다.
        imagesLoaded(document.querySelectorAll(selector), { background: true }, resolve);
    });
};

// 글꼴 미리 로드
const preloadFonts = (id) => {
    return new Promise((resolve) => {
        WebFont.load({
            typekit: {
                id: id
            },
            active: resolve
        });
    });
};

// 다른 모듈에서 사용할 수 있도록 유틸리티 함수 내보내기.
export {
    preloadImages,
    preloadFonts
};