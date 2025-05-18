const formValidator = {
    validateForm(materialInputs, photoInput, infoInput, dateInput) {
        let isValid = true;
        const errors = [];

        const materialSelected = Array.from(materialInputs).some(input => input.checked);
        if(!materialSelected){
            errors.push('Выберите степень повреждения');
            document.querySelector('.color').classList.add('invalid-border');
        } else {
            document.querySelector('.color').classList.remove('invalid-border');
        }

        const fields = [
            {element: photoInput, error: 'Загрузите фотографию', condition: ()=> !photoInput.files.length},
            {element: infoInput, error: 'Введите описание', condition: () => !infoInput.value.trim()},
            {element: dateInput, error: 'Укажите дату', condition: () => !dateInput.value}
        ];

        fields.forEach(({element, error, condition}) => {
            if (condition()) {
              errors.push(error);
              element.classList.add('invalid');
              isValid = false;
            } else {
              element.classList.remove('invalid');
            }
          });

        if (errors.length > 0) {
    showErrorModal(errors[0]);  // <== Здесь
    const firstErrorElement = [materialInputs[0].parentElement, photoInput, infoInput, dateInput]
        .find(el => el.classList.contains('invalid') || el.classList.contains('invaid-border'));

    if (firstErrorElement) {
        firstErrorElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
    }
}

        return isValid;
    },
    setupFormListeners(inputs, materialInputs) {
        inputs.forEach(field => {
            field.addEventListener('input', () => {
                field.classList.remove('invalid');
                infoMessage.classList.remove('visible');
            });
        });

        materialInputs.forEach(input => {
            input.addEventListener('change', () => {
                document.querySelector('.color').classList.remove('invalid-border');
                infoMessage.classList.remove('visible');
            });
        });
    }
};