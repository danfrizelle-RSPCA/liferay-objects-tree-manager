const button = fragmentElement.querySelector('button');

const isMultistepButton = fragmentElement.querySelector(
	`#fragment-${fragmentNamespace}-form-button`
);

button.addEventListener('click', ({ target }) => {
	const isEditable =
		target.hasAttribute('data-lfr-editable-id') ||
		target.hasAttribute('contenteditable');

	if (isEditable && layoutMode === 'edit') {
		return;
	}

	if (isMultistepButton) {
		Liferay.fire('formFragment:changeStep', {
			emitter: fragmentElement,
			step: configuration.type,
		});
	}
	else {
		window.parent.postMessage(
			{ type: 'FORM_SUBMIT', version: 1 },
			window.location.origin
		);
		Liferay.fire('formFragment:submit');
	}
});