document.addEventListener('DOMContentLoaded', function () {
  // Проверяем состояние чекбоксов при загрузке страницы
  updateParametersFromCheckboxes();

  // Назначаем слушатель события на изменение состояния чекбоксов
  document.querySelectorAll('input[type="checkbox"]').forEach(input => {
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
    // Выбор всех блоков вопросов
    const questions = document.querySelectorAll('.question');

    // Проходим по каждому вопросу
    questions.forEach(function (questionBlock) {
      // Поиск списка ответов
      const answerItems = questionBlock.querySelectorAll('.question__answers-list-item');

      // Перебираем каждый пункт ответа
      answerItems.forEach(function (item) {
        // Проверяем, помечен ли этот ответ как верный
        const correctField = item.querySelector('input[name$=".correct"]');
        const checkboxDiv = item.querySelector('.checkbox'); // Контейнер с чекбоксом
        if (correctField && correctField.value === 'true') {
          checkboxDiv.className = 'checkbox checkbox-green';
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
          // Если включён hfa, скрываем неправильные ответы
          if (hideFailAnswers) {
            item.setAttribute('style', 'display: none;');
          } else {
            item.removeAttribute('style');
            // Иначе делаем красными неправильные ответы
            checkboxDiv.className = 'checkbox checkbox-red';
          }
        };
      });
    });
  };
});

