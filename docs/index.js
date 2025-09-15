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
    const checkboxDiv = item.querySelector('.checkbox'); // Здесь будем менять класс div

    if (correctField && correctField.value === 'true') {
      // Ответ правильный, добавляем класс checkbox-green-checked
      checkboxDiv.className = 'checkbox checkbox-green-checked';
      // Ставим чекбокс на правильном ответе
      const checkbox = item.querySelector('input[type="checkbox"]');
      if (checkbox) {
        checkbox.checked = true;
      }
    } else {
      // Ответ неправильный, добавляем класс checkbox-red
      checkboxDiv.className = 'checkbox checkbox-red';
    }
  });
});

