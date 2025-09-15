document.addEventListener('DOMContentLoaded', function () {
  // Проверяем параметры в URL
  // Получаем URL страницы
  const urlString = window.location.href;

  // Создаем экземпляр URLSearchParams
  const searchParams = new URLSearchParams(new URL(urlString).search);

  // Читаем конкретные параметры
  const selectValidAnswer = searchParams.has('sva');
  const showNTD = searchParams.has('sntd');
  const hideFailAnswers = searchParams.has('hfa');

  if (showNTD) {
    document.querySelectorAll('div.row.ntdLink').forEach(el => el.removeAttribute('style'))
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
          // Иначе делаем красными неправильные ответы
          checkboxDiv.className = 'checkbox checkbox-red';
        }
      }
    });
  });
});

