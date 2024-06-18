/**
 * @param {HTMLDivElement} element
 */
export function closeOnEscape(element) {
	const handleKeydown = (/** @type {KeyboardEvent} */ e) => {
		var isEscPressed = e.key === 'Escape';

		if (!isEscPressed) {
			return;
		}

		element.dispatchEvent(new CustomEvent('escape'));
	};

	document.addEventListener('keydown', handleKeydown, true);

	return {
		destroy() {
			document.removeEventListener('keydown', handleKeydown, true);
		}
	};
}

/**
 * @param {HTMLDivElement} element
 */
export function closeOnClickOutside(element) {
	const handleClick = (/** @type {MouseEvent} */ e) => {
		if (e.target instanceof HTMLElement && !element.contains(e.target)) {
			element.dispatchEvent(new CustomEvent('outclick'));
		}
	};
	document.addEventListener('click', handleClick, true);

	return {
		destroy() {
			document.removeEventListener('click', handleClick, true);
		}
	};
}

/**
 * @param {HTMLDivElement} element
 */
export function trapFocus(element) {
	// var focusableElements = element.querySelectorAll(
	// 	'a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled])'
	// );

	var focusableElements = element.querySelectorAll('a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled])');

	var firstFocusableElement = focusableElements[0];
	var lastFocusableElement = focusableElements[focusableElements.length - 1];

	const handleKeydown = (/** @type {KeyboardEvent} */ e) => {
		var isTabPressed = e.key === 'Tab';

		if (!isTabPressed) {
			return;
		}

		if (e.shiftKey) {
			if (document.activeElement === firstFocusableElement && lastFocusableElement instanceof HTMLElement) {
				lastFocusableElement.focus();
				e.preventDefault();
			}
		} else {
			if (document.activeElement === lastFocusableElement && firstFocusableElement instanceof HTMLElement) {
				firstFocusableElement.focus();
				e.preventDefault();
			}
		}
	};

	element.addEventListener('keydown', handleKeydown);

	return {
		destroy() {
			document.removeEventListener('keydown', handleKeydown);
		}
	};
}
