// index.js

window.onload = function () {
  var consentModal = document.getElementById("cookie-consent-modal");

  // Проверяем, приняли ли пользователь условия раньше (через cookie)
  if (!getCookie('cookiesAccepted')) {
    consentModal.classList.remove('hidden'); // Открываем модальное окно
  }
};

// Функция принятия соглашения
function acceptCookies() {
  setCookie('cookiesAccepted', true, 365); // Согласие хранится в течение года
  document.getElementById("cookie-consent-modal").classList.add('hidden'); // Скрываем модальное окно
}

// Читатель cookie
function getCookie(name) {
  const matches = document.cookie.match(new RegExp(
    "(?:^|; )" + encodeURIComponent(name).replace(/[\-\.\+\*]/g, "\\$&") + "=([^;]*)"
  ));
  return matches ? JSON.parse(decodeURIComponent(matches[1])) : undefined;
}

// Установщик cookie
function setCookie(name, value, days) {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = `${name}=${encodeURIComponent(JSON.stringify(value))}${expires}; path=/`;
}



document.addEventListener('DOMContentLoaded', function () {

  // загрузка предыдущего состояния из cookie
  function loadState() {
    const state = getCookie('state') || {};
    Object.keys(state).forEach(key => {
      document.querySelectorAll(`input[type="checkbox"]:not([name="ql"])`).forEach(input => {
        if (input.name === key) input.checked = state[key]
      });
    });

    // Восстанавливаем состояние выученных вопросов
    const learnedQuestions = getCookie('learnedQuestions') || [];
    document.querySelectorAll('input[name="ql"]').forEach((checkbox, i) => {
      checkbox.checked = learnedQuestions.includes(i);
    });

  }

  // сохранение текущего состояния в cookie
  function saveState() {
    const inputs = document.querySelectorAll('input[type="checkbox"]:not([name="ql"])');
    const state = {};
    inputs.forEach(input => {
      if (input.checked && input.name.length > 2) {
        state[input.name] = input.checked;
      }
    });
    setCookie('state', state, 30); // Сохраняем на 30 дней

    // Сохраняем состояние выученных вопросов
    const learnedQuestions = Array.from(document.querySelectorAll('input[name="ql"]'))
      .map((el, idx) => el.checked ? idx : null)
      .filter(idx => idx !== null);
    setCookie('learnedQuestions', learnedQuestions, 30); // Сохраняем на 30 дней
  }

  // добавление чекбоксов "Выучен" каждому вопросу
  function addLearnCheckboxes() {
    const questionNumbers = document.querySelectorAll('div.question__number');
    questionNumbers.forEach(questionNumber => {
      const checkboxContainer = document.createElement('div');
      checkboxContainer.className = 'checkbox learn-status';
      const label = document.createElement('label');
      label.textContent = 'Выучен';
      const input = document.createElement('input');
      input.type = 'checkbox';
      input.name = 'ql';
      const check = document.createElement('div');
      check.className = 'check';
      checkboxContainer.appendChild(label);
      label.appendChild(input);
      input.addEventListener('change', () => {
        updateParametersFromCheckboxes();
        // Проверяем, приняли ли пользователь условия раньше (через cookie)
        if (getCookie('cookiesAccepted')) saveState();

      });
      label.appendChild(check);
      questionNumber.parentNode.insertBefore(checkboxContainer, questionNumber.nextSibling);
    });
  }

  // Обновление заголовка с количеством вопросов
  function updateHeader(totalQuestions, learnedQuestions) {
    const remaining = totalQuestions - learnedQuestions;
    const headerElement = document.querySelector('div.head.sticky-top label#questions-count-header');
    headerElement.innerHTML = `<label id="questions-count-header">Осталось изучить ${remaining} из  ${totalQuestions} </label`;
  }

  // чтения текущих параметров
  function updateParametersFromCheckboxes() {
    const allQuestions = document.querySelectorAll('div.question__number').length;
    const questionsLearning = document.querySelectorAll('div.checkbox.learn-status > label > input[type="checkbox"]:checked').length;
    // Обновляем заголовок с числом оставшихся вопросов
    updateHeader(allQuestions, questionsLearning);

    // Получаем список всех вопросов
    const questionElements = document.querySelectorAll('.question.row');

    const hlqCheckbox = document.querySelector('input[name="hlq"]');
    // Применяем фильтр для выученных вопросов, если выбран режим их скрытия
    if (hlqCheckbox.checked) {
      questionElements.forEach((questionEl) => {
        const learnStatusInput = questionEl.querySelector('input[name="ql"]:checked');
        if (learnStatusInput) {
          questionEl.style.display = 'none'; // Скрываем выученный вопрос
        } else {
          questionEl.style.display = '';     // Показываем остальные вопросы
        }
      });
    } else {
      // Если скрытие выключено, показываем все вопросы
      questionElements.forEach((questionEl) => {
        questionEl.style.display = '';
      });
    }

    // Устанавливаем параметры на основании состояния чекбоксов
    const vntdCheckbox = document.querySelector('input[name="vntd"]');
    const showNTD = vntdCheckbox.checked;
    const ntdLinks = document.querySelectorAll('div.row.ntdLink');
    if (showNTD) {
      ntdLinks.forEach(el => el.removeAttribute('style'));
    } else {
      ntdLinks.forEach(el => el.setAttribute('style', 'display: none;'));
    }

    // Устанавливаем параметры на основании состояния чекбоксов
    const hfaCheckbox = document.querySelector('input[name="hfa"]');
    const hideFailAnswers = hfaCheckbox.checked;
    const svaCheckbox = document.querySelector('input[name="sva"]');
    const selectValidAnswer = svaCheckbox.checked;

    // Поиск списка ответов
    const answerItems = document.querySelectorAll('.question__answers-list-item');

    // Перебираем каждый пункт ответа
    answerItems.forEach(function (item) {
      // Считываем поле корректности ответа
      const correctField = item.querySelector('input[name$=".correct"]');
      // получае Контейнер с чекбоксом ответа
      const checkboxDiv = item.querySelector('div.checkbox');

      // Проверяем, помечен ли этот ответ как верный
      if (correctField && correctField.value === 'true') {
        checkboxDiv.classList.add('green');
        checkboxDiv.classList.remove('red');

        // Если включена SVA, ставим чекбокс на правильном ответе
        const checkbox = item.querySelector('input[type="checkbox"]');
        if (selectValidAnswer) {
          checkbox.checked = true;
        } else {
          const state = getCookie('state') || {};
          checkbox.checked = state.hasOwnProperty(checkbox.name) ? state[checkbox.name] : false;
        }
      } else {
        if (correctField && correctField.value === 'false') {
          // Красим неправильные ответы красным цветом
          checkboxDiv.classList.add('red');
          checkboxDiv.classList.remove('green');
        }

        // Скрываем неправильные ответы, если включен HFA
        if (hideFailAnswers) {
          item.setAttribute('style', 'display: none;');
        } else {
          item.removeAttribute('style');
        }
      }
    });

    if (hideFailAnswers || showNTD) { if (getCookie('cookiesAccepted')) loadState; }
    // saveState();
  }

  // добавление чекбоксов "Выучен"
  addLearnCheckboxes();

  // Загружаем состояние при старте
  loadState();

  // Проверяем состояние чекбоксов при загрузке страницы
  updateParametersFromCheckboxes();

  // Назначаем слушатель события на изменение состояния чекбоксов в шапке
  document.querySelectorAll('div.head input[type="checkbox"]').forEach(input => {
    input.addEventListener('change', () => {
      // Проверяем, приняли ли пользователь условия раньше (через cookie)
      if (getCookie('cookiesAccepted')) saveState(); // Сохраняем состояние при любом изменении чекбокса
      updateParametersFromCheckboxes(); // Обновляем параметры
    });
  });

  document.querySelectorAll('div.question__answers-list input[type="checkbox"]:not([name="ql"])').forEach(input => {
    input.addEventListener('change', () => {
      // Проверяем, приняли ли пользователь условия раньше (через cookie)
      if (getCookie('cookiesAccepted')) saveState(); // Сохраняем состояние при любом изменении чекбокса
    });
  });

  const btnCookiesClear = document.getElementById('cookies-clear');
  btnCookiesClear.addEventListener('click',() => {
      // Проверяем, приняли ли пользователь условия раньше (через cookie)
      if (getCookie('cookiesAccepted')) {
        setCookie('state', {}, 30); // Сохраняем на 30 дней
      }
    });
});
