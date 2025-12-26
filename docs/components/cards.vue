export default {
  props: ['cards'],
  data() {
    return {
      showAnswers: false,
      hideOptions: false,
      showNorms: false,
      hideLearned: false,
      completedQuestions: {}
    };
  },
  computed: {
    totalQuestionsCount() {
      return this.cards.length;
    },
    remainingQuestionsCount() {
      return this.totalQuestionsCount - Object.values(this.completedQuestions).filter(status => status).length;
    },
    filteredCards() {
      return this.hideLearned
        ? this.cards.filter(card => !this.isQuestionCompleted(parseInt(card.number.slice(8))))
        : this.cards;
    }
  },
  methods: {
    async loadCards() {
      try {
        const response = await fetch('/data/cards.json');
        const json = await response.json();
        this.cards = Object.entries(json).map(([number, card]) => ({
          number,
          question: card.question,
          answers: card.answers.map(a => ({ answer: a.answer, correct: a.correct })),
          link: card.link
        }));
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
      }
    },
    markAsCompleted(index) {
      this.$set(this.completedQuestions, index, true);
    },
    isQuestionCompleted(index) {
      return !!this.completedQuestions[index];
    },
    resetStates() {
      this.completedQuestions = {};
    },
    acceptCookies() {
      document.getElementById('cookie-consent-modal').classList.add('hidden');
    },
    showAnswer(idx) {
      return this.showAnswers || idx === this.cards[this.currentIndex].answers.findIndex(a => a.correct);
    }
  },
  template: `
    <div id="app">
      <div id="cookie-consent-modal" class="modal-cookie hidden">
        <div class="modal-content">
          <p>Данный веб-сайт использует файлы cookie для сохранения параметров.</p>
          <button @click="acceptCookies">Принять</button>
        </div>
      </div>
      <div class="head sticky-top">
        <label><input v-model="showAnswers" type="checkbox" name="sva" value="true">Показать ответы</label>
        <label><input v-model="hideOptions" type="checkbox" name="hfa" value="true">Скрыть варианты</label>
        <label><input v-model="showNorms" type="checkbox" name="vntd" value="true">Показать нормы</label>
        <label><input v-model="hideLearned" type="checkbox" name="hlq" value="false">Скрыть выученные</label>
        <label id="questions-count-header">Осталось изучить {{ remainingQuestionsCount }} из {{ totalQuestionsCount }}</label>
        <button style="background-color: darkmagenta;margin: 6px 4px;padding: 0px 6px;border-radius: 10px;" id="cookies-clear" title="сбросить состояние выученных вопросов" @click="resetStates">сброс</button>
      </div>
      <div class="header header__main">
        <h3>Эксплуатация электроустановок потребителей<br/>(IV группа по электробезопасности до 1000 В)</h3>
      </div>
      <div class="container">
        <div class="wrapper">
          <div class="content">
            <template v-for="(card, index) in filteredCards">
              <div class="question row">
                  <div class="question__number">{{ card.number }}</div>
                  <div class="question__text">{{ card.question }}</div>
                  <div class="question__answers-list" v-if="!hideOptions">
                      <div class="question__answers-list-item" v-for="(answer, idx) in card.answers" :style="{ display: showAnswer(idx) ? '' : 'none' }">
                          <input type="hidden" :name="'questionList['+index+'].answers['+idx+'].correct'" :value="answer.correct">
                              <div class="checkbox" :class="answer.correct ? 'green' : 'red'">
                                  <label>
                                      <input type="hidden" :name="'questionList['+index+'].answers['+idx+'].checked'" value="false">
                                      <input type="checkbox" :name="'questionList['+index+'].answers['+idx+'].checked'" :disabled="isQuestionCompleted(index)" @change="markAsCompleted(index)">
                                      <div class="check"></div>
                                      <span class="label">{{ answer.answer }}</span>
                                  </label>
                              </div>
                      </div>
                  </div>
                  <div class="row ntdLink" :style="{ display: showNorms ? '' : 'none' }">
                      <div style="font-weight: bold; font-size: 0.9em">Ссылка на НТД:</div>
                      <span style="display:block" class="bg-yellow">{{ card.link }}</span>
                  </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  `
};
