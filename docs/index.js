document.addEventListener('DOMContentLoaded', function () {
  // Проверяем состояние чекбоксов при загрузке страницы
  updateParametersFromCheckboxes();

  // Назначаем слушатель события на изменение состояния чекбоксов в шапке
  document.querySelectorAll('div.head input[type="checkbox"]').forEach(input => {
    input.addEventListener('change', updateParametersFromCheckboxes);
  });

  // Функция чтения текущих параметров
  function updateParametersFromCheckboxes() {
    const svaCheckbox = document.querySelector('input[name="sva"]');
    const hfaCheckbox = document.querySelector('input[name="hfa"]');
    const vntdCheckbox = document.querySelector('input[name="vntd"]');

    // Устанавливаем параметры на основании состояния чекбоксов
    const selectValidAnswer = svaCheckbox.checked;
    const hideFailAnswers = hfaCheckbox.checked;
    const showNTD = vntdCheckbox.checked;
    const ntdLinks = document.querySelectorAll('div.row.ntdLink');
    if (showNTD) {
      ntdLinks.forEach(el => el.removeAttribute('style'));
    } else {
      ntdLinks.forEach(el => el.setAttribute('style', 'display: none;'));
    }
    // Поиск списка ответов
    const answerItems = document.querySelectorAll('.question__answers-list-item');

    // Перебираем каждый пункт ответа
    answerItems.forEach(function (item) {
      // Считываем поле корректности ответа
      const correctField = item.querySelector('input[name$=".correct"]');
      // Контейнер с чекбоксом
      const checkboxDiv = item.querySelector('div.checkbox');
      // Проверяем, помечен ли этот ответ как верный
      if (correctField && correctField.value === 'true') {
        checkboxDiv.classList.add('green');
        checkboxDiv.classList.remove('red');
        // Если включёна sva, выделяем правильный ответ
        const checkbox = item.querySelector('input[type="checkbox"]');
        if (selectValidAnswer) {
          // Ставим чекбокс на правильном ответе
          if (checkbox) {
            checkbox.checked = true;
          }
        } else {
          // Удаляем чекбокс на правильном ответе
          if (checkbox) {
            checkbox.checked = false;
          }
        }
      } else {
        if (correctField && correctField.value === 'false') {
          // Иначе делаем красными неправильные ответы
          checkboxDiv.classList.add('red');
          checkboxDiv.classList.remove('green');
        }
        // Если включён hfa, скрываем неправильные ответы
        if (hideFailAnswers) {
          item.setAttribute('style', 'display: none;');
        } else {
          item.removeAttribute('style');
        }
      };
    });
  }
});

