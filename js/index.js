// 필요한 유틸리티와 모듈 가져오기
import { preloadFonts, preloadImages } from './utils.js'; // 유틸리티 가져오기
import { Item } from './item.js'; // Item 모듈 가져오기

// Lenis 부드러운 스크롤 객체를 저장할 변수
let lenis;

// 배경 이미지를 담고 있는 컨테이너 요소를 찾아 이미지를 추출
const decoEl = document.querySelector('.deco');
const images = [...decoEl.querySelectorAll('.deco__item')];

// 'data-text' 속성이 있는 요소를 찾아서 추출
const items = [...document.querySelectorAll('[data-text]')];
const ItemsArray = []; // 아이템을 저장할 배열

// 'data-text' 속성을 기반으로 아이템을 생성하는 함수
const createItems = () => {
	items.forEach(item => {
		let totalCells; // 아이템의 totalCells 값을 저장할 변수
		const effect = item.dataset.effect; // 아이템의 data-effect 속성 가져오기

		// 효과에 따라 다른 totalCells 값을 설정
		switch (effect) {
			case '1':
			case '2':
			case '3':
				totalCells = 4;
				break;
			case '4':
				totalCells = 6;
				break;
			default:
				totalCells = 6; // 일치하는 효과가 없을 때의 기본 값
				break;
		}

		ItemsArray.push(new Item(item, totalCells)); // Item 인스턴스를 생성하고 ItemsArray에 저장
	});
}

// 특정 속성을 사용하여 Lenis를 초기화하는 함수
const initSmoothScrolling = () => {
	// 지정된 속성을 사용하여 Lenis 객체를 인스턴스화
	lenis = new Lenis({
		lerp: 0.2, // 낮은 값일수록 부드러운 스크롤 효과를 생성
		smoothWheel: true // 마우스 휠 이벤트에 대한 부드러운 스크롤 활성화
	});

	// 사용자가 스크롤할 때마다 ScrollTrigger를 업데이트
	lenis.on('scroll', () => ScrollTrigger.update());

	// 각 애니메이션 프레임에서 실행할 함수를 정의
	const scrollFn = (time) => {
		lenis.raf(time); // Lenis의 requestAnimationFrame 메서드 실행
		requestAnimationFrame(scrollFn); // 각 프레임에서 재귀적으로 scrollFn 호출
	};
	// 애니메이션 프레임 루프 시작
	requestAnimationFrame(scrollFn);
};

// 효과 번호에 따라 다른 타임라인/애니메이션을 정의하는 함수들
const fx1Timeline = item => {
	// 효과 번호 1에 대한 애니메이션 정의
	const itemInner = item.DOM.inner;
	
	const initialValues = {
		x: 13
	};

	gsap.fromTo(itemInner, {
		xPercent: (pos, _, arr) => pos < arr.length/2 ? -initialValues.x*pos-initialValues.x : initialValues.x*(pos-arr.length/2)+initialValues.x,
	}, {
		ease: 'power1',
		xPercent: 0,
		scrollTrigger: {
			trigger: item.DOM.el,
			start: 'top bottom',
			end: 'top top+=10%',
			scrub: true
		}
	});
}

const fx2Timeline = item => {
	const itemInner = item.DOM.inner;
	const itemInnerWrap = item.DOM.innerWrap;

	const initialValues = {
		x: 30
	};

	gsap.timeline({
		defaults: {
			ease: 'power1'
		},
		scrollTrigger: {
			trigger: item.DOM.el,
			start: 'top bottom',
			end: 'top top+=10%',
			scrub: true
		}
	})
	.fromTo(itemInner, {
		xPercent: pos => initialValues.x*pos
	}, {
		xPercent: 0
	}, 0)
	.fromTo(itemInnerWrap, {
		xPercent: pos => 2*(pos+1)*10
	}, {
		xPercent: 0
	}, 0);
}

const fx3Timeline = item => {
	const itemInner = item.DOM.inner;
	const itemInnerWrap = item.DOM.innerWrap;
	
	const intervalPixels = 100; // 픽셀 간격
	const totalElements = itemInnerWrap.length;
	// 마지막 요소를 제외한 모든 itemInner 요소가 차지하는 총 너비를 계산합니다.
	const totalWidth = (totalElements - 1) * intervalPixels;
	// 요소를 가운데로 배치하기 위한 오프셋을 계산합니다.
	const offset = (totalWidth / 2) * -1;
	
	const initialValues = {
		x: 30,
		y: -15,
		rotation: -5
	};

	gsap.timeline({
		defaults: {
			ease: 'power1',
		},
		scrollTrigger: {
			trigger: item.DOM.el,
			start: 'top bottom',
			end: 'top top+=10%',
			scrub: true
		}
	})
	.fromTo(itemInner, {
		xPercent: (pos, _, arr) => pos < arr.length/2 ? -initialValues.x*pos-initialValues.x : initialValues.x*(pos-arr.length/2)+initialValues.x,
		yPercent: (pos, _, arr) => pos < arr.length/2 ? initialValues.y*(arr.length/2-pos) : initialValues.y*((pos+1)-arr.length/2),
	}, {
		xPercent: 0,
		yPercent: 0
	}, 0)

	.fromTo(itemInnerWrap, {	
		xPercent: pos => {
			const distanceFromCenter = pos * intervalPixels;
			const xPercent = distanceFromCenter + offset;
			return xPercent;
		},		
		rotationZ: (pos, _, arr) => pos < arr.length/2 ? -initialValues.rotation*(arr.length/2-pos)-initialValues.rotation : initialValues.rotation*(pos-arr.length/2)+initialValues.rotation
	}, {
		xPercent: 0,
		rotationZ: 0
	}, 0);
}

const fx4Timeline = item => {
	const itemInner = item.DOM.inner;
	const itemInnerWrap = item.DOM.innerWrap;
	
	const intervalPixels = 100; // 간격 픽셀
	const totalElements = itemInnerWrap.length;
	// 마지막 요소를 제외한 모든 itemInner 요소가 차지하는 총 너비를 계산합니다.
	const totalWidth = (totalElements - 1) * intervalPixels;
	// 요소를 가운데로 배치하기 위한 오프셋을 계산합니다.
	const offset = (totalWidth / 2) * -1;

	const initialValues = {
		x: 50
	};

	
	gsap.timeline({
		defaults: {
			ease: 'power1',
		},
		scrollTrigger: {
			trigger: item.DOM.el,
			start: 'top bottom+=30%',
			end: 'top top+=10%',
			scrub: true
		}
	})
	.fromTo(itemInner, {
		xPercent: (pos, _, arr) => pos < arr.length/2 ? -initialValues.x*pos-initialValues.x : initialValues.x*(pos-arr.length/2)+initialValues.x,
		//filter: 'blur(15px)'
	}, {
		xPercent: 0,
		//filter: 'blur(0px)'
	}, 0)
	.fromTo(itemInner, {
		scaleX: 1.5,
		scaleY: 0,
		transformOrigin: '50% 0%'
	}, {
		ease: 'power2.inOut',
		scaleX: 1,
		scaleY: 1
	}, 0)
	.fromTo(itemInnerWrap, {			
		xPercent: pos => {
			const distanceFromCenter = pos * intervalPixels;
			const xPercent = distanceFromCenter + offset;
			return xPercent;
		},
	}, {
		xPercent: 0,
		stagger: {
			amount: 0.07,
			from: 'center'
		}
	}, 0);
}

const fx5Timeline = item => {
	const itemInner = item.DOM.inner;
	
	const initialValues = {
		x: 20
	};
	
	gsap.timeline({
		defaults: {
			ease: 'power1',
		},
		scrollTrigger: {
			trigger: item.DOM.el,
			start: 'top bottom',
			end: 'top top+=10%',
			scrub: true
		}
	})
	.fromTo(itemInner, {
		xPercent: (pos, _, arr) => pos < arr.length/2 ? -initialValues.x*pos-initialValues.x : initialValues.x*(pos-arr.length/2)+initialValues.x,
		yPercent: (pos, _, arr) => pos%2 === 0 ? -40 : 40,
	}, {
		xPercent: 0,
		yPercent: 0
	}, 0);
}

const fx6Timeline = item => {
	// Define animations for effectNumber 1
	const itemInner = item.DOM.inner;
	const itemInnerWrap = item.DOM.innerWrap;

	const initialValues = {
		x: 6
	};
	
	gsap.timeline({
		scrollTrigger: {
			trigger: item.DOM.el,
			start: 'top bottom',
			end: 'top top',
			scrub: true
		}
	})
	.fromTo(itemInner, {
		xPercent: (pos,_,arr) => (arr.length-pos-1)*-initialValues.x-initialValues.x,
	}, {
		ease: 'power1',
		xPercent: 0
	}, 0)
	.fromTo(itemInnerWrap, {			
		yPercent: pos => pos*20
	}, {
		yPercent: 0
	}, 0);
}

const defaultTimeline = item => {
	// Define animations for effectNumber 1
	const itemInner = item.DOM.inner;
	
	const initialValues = {
		x: 10
	};
	
	gsap.fromTo(itemInner, {
		xPercent: (pos, _, arr) => pos < arr.length/2 ? pos*-initialValues.x-initialValues.x : (pos-arr.length/2)*initialValues.x+initialValues.x,
	}, {
		ease: 'power1',
		xPercent: 0,
		scrollTrigger: {
			trigger: item.DOM.el,
			start: 'top bottom',
			end: 'top top+=10%',
			scrub: true
		}
	});
}

// Function to create animations for images triggered by scrolling
const fxImagesTimeline = () => {
	images.forEach(image => {
		gsap.fromTo(image, {
			transformOrigin: '800% 50%',
			rotationZ: -8
		}, {
			ease: 'power1',
			rotationZ: 5,
			scrollTrigger: {
				trigger: image,
				start: 'top bottom',
				end: 'top top+=10%',
				scrub: true
			}
		});
	});
}

// 항목에 스크롤 트리거 애니메이션을 적용하는 함수
const scroll = () => {
    for (let i = 0, length = ItemsArray.length; i <= length - 1; ++i) {
        const item = ItemsArray[i];
        
        // 데이터 속성에서 전달된 효과 번호
        const effect = item.DOM.el.dataset.effect; // data-effect 속성 가져오기
        
        // 효과 번호에 따라 다른 타임라인 적용
        switch (effect) {
            case '1':
                fx1Timeline(item);
                break;
            case '2':
                fx2Timeline(item);
                break;
            case '3':
                fx3Timeline(item);
                break;
            case '4':
                fx4Timeline(item);
                break;
            case '5':
                fx5Timeline(item);
                break;
            case '6':
                fx6Timeline(item);
                break;
            default:
                // 일치하는 효과가 없는 경우 기본 타임라인 설정
                defaultTimeline(item);
                break;
        }
    }    
    // 스크롤에 의해 트리거된 이미지 애니메이션 적용
    fxImagesTimeline();
}

// 애니메이션 초기화 함수
const init = () => {
    initSmoothScrolling(); // Lenis를 사용하여 부드러운 스크롤 초기화
    createItems(); // 데이터 속성을 기반으로 항목 생성
    scroll(); // 항목에 스크롤 트리거 애니메이션 적용
};

// 글꼴 및 이미지 미리로드 후 애니메이션 초기화
Promise.all([preloadImages('.deco__item'), preloadFonts('ejh4sem')]).then(() => {
    document.body.classList.remove('loading'); // 문서에서 'loading' 클래스 제거
    init(); // 글꼴 및 이미지 미리로드 후 애니메이션 초기화
});