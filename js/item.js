export class Item {
	DOM = {
		el: null,       // 메인 DOM 요소 (클래스 'gtext'를 가진 요소).
		inner: null,    // 내부 DOM 요소들 (클래스 'gtext__box-inner'를 가진 요소들).
		innerWrap: null // 내부 부모 DOM 요소 (클래스 'gtext__box'를 가진 요소들).
	};
	totalCells = 1;     // 기본 셀 수.

	/**
	 * Constructor for the Item class.
	 * @param {HTMLElement} DOM_el - 
	 * @param {number} totalCells - 
	 */
	constructor(DOM_el, totalCells) {
		this.DOM.el = DOM_el;       // 주어진 DOM 요소를 `DOM.el`에 할당.
		this.totalCells = totalCells; // 주어진 셀 수를 `totalCells`에 설정.

		this.layout();             // 내부 요소들을 생성.
		this.setCSSValues();       // CSS 값을 설정하고 초기화.

		window.addEventListener('resize', () => this.setCSSValues()); // 창 크기 변경 시 CSS 값을 업데이트.
	}

	/**
	 * 
	 */
	layout() {
		let newHTML = '';
		for (let i = 0; i < this.totalCells; ++i) {
			newHTML += `<span class="gtext__box"><span class="gtext__box-inner">${this.DOM.el.dataset.text}</span></span>`;
		}

		this.DOM.el.innerHTML = newHTML; // 새 HTML을 메인 요소에 설정.
		this.DOM.innerWrap = this.DOM.el.querySelectorAll('.gtext__box'); // `gtext__box` 요소들 선택.
		this.DOM.inner = this.DOM.el.querySelectorAll('.gtext__box-inner'); // `gtext__box-inner` 요소들 선택.
	}

	/**
	 * 
	 */
	setCSSValues() {
		const computedWidth = window.getComputedStyle(this.DOM.inner[0]).width; // 첫 번째 내부 요소의 너비를 가져옴.

		this.DOM.el.style.setProperty('--text-width', computedWidth); // 텍스트 너비를 CSS 커스텀 속성으로 설정.
		this.DOM.el.style.setProperty('--gsplits', this.totalCells);  // 셀의 총 개수를 CSS 커스텀 속성으로 설정.

		const offset = parseFloat(computedWidth) / this.totalCells; // 각 셀의 오프셋을 계산.
		this.DOM.inner.forEach((inner, pos) => {
			gsap.set(inner, { left: offset * -pos }); // `gsap`을 사용하여 각 내부 요소의 위치를 설정.
		});
	}
}
