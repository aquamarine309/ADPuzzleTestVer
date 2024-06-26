import ModalWrapperChoice from "./ModalWrapperChoice.js";
import PrimaryButton from "../PrimaryButton.js";
import SliderComponent from "../SliderComponent.js";

const operators = [
  {
    name: "+",
    fn: (a, b) => a + b,
    genBase: r => {
      const a = randomInt(r);
      const b = r - a;
      return [a, b];
    },
    canGen: r => r > 1,
    priority: 0
  },
  {
    name: "-",
    fn: (a, b) => a - b,
    genBase: r => {
      const b = randomInt(20, 1);
      const a = b + r;
      return [a, b];
    },
    canGen: () => true,
    priority: 2
  },
  {
    name: "×",
    fn: (a, b) => a * b,
    genBase: r => {
      let a, b;
      for (let i = 2; i * i <= r; i++) {
        if (Number.isInteger(r / i)) {
          a = i;
          b = r / i
          if (randomIn(Math.pow(r, 2))) break;
        }
      }
      return [a, b];
    },
    canGen: r => {
      if (r <= 1) return false;
      for (let i = 2; i * i <= r; i++) {
        if (Number.isInteger(r / i)) return true;
      }
      return false;
    },
    priority: 3
  },
  {
    name: "/",
    fn: (a, b) => a / b,
    priority: 4,
    genBase: r => {
      const b = randomInt(10, 2);
      const a = b * r;
      return [a, b];
    },
    canGen: r => r > 0,
  },
  {
    name: "^",
    fn: (a, b) => Math.pow(a, b),
    priority: 5,
    genBase: r => {
      if (r === 0) {
        return [0, randomInt(10, 1)];
      }
      if (r === 1) {
        if (randomIn(2)) {
          return [1, randomInt(10)];
        } else {
          return [randomInt(10), 0];
        }
      }
      if (Number.isInteger(Math.sqrt(r))) return [Math.sqrt(r), 2];
      if (Number.isInteger(Math.cbrt(r))) return [Math.cbrt(r), 3];
      return [r, 1];
    },
    canGen: r => true,
  }
];

const randomInt = (x, y = 0) => Math.floor(Math.random() * (x - y)) + y;
const randomIn = x => Math.random() < 1 / x;

export function baseEquationGenerator(answer = randomInt(10)) {
  if (Math.random() > 0.1) {
    return {
      equation: answer.toString(),
      result: answer,
      priority: Number.MAX_VALUE * Math.sign(answer + 1)
    }
  }
  let operator = operators.randomElement();
  while (!operator.canGen(answer)) {
    operator = operators.randomElement();
  }
  const numbers = operator.genBase(answer);
  const result = operator.fn(...numbers);
  const equation = `${numbers.map(n => n >= 0 ? n : formatBracket(n)).join(operator.name)}`
  return {
    equation,
    result,
    priority: operator.priority
  }
};

function formatBracket(x) {
  return `(${x})`;
}

export function secondEquationGenerator(answer = randomInt(10)) {
  if (randomIn(8)) {
    return {
      equation: answer.toString(),
      result: answer,
      priority: Number.MAX_VALUE * Math.sign(answer + 1)
    }
  }
  let operator = operators.randomElement();
  while (!operator.canGen(answer)) {
    operator = operators.randomElement();
  }
  const number = operator.genBase(answer);
  const base1 = baseEquationGenerator(number[0]);
  if (operator.priority > base1.priority ||
    (operator.priority >= base1.priority && operator.priority >= 5)
  ) {
    base1.equation = formatBracket(base1.equation);
  }
  const base2 = baseEquationGenerator(number[1]);
  if (operator.priority > base2.priority) {
    base2.equation = formatBracket(base2.equation);
  }
  const result = operator.fn(base1.result, base2.result);
  const equation = `${base1.equation}${operator.name}${base2.equation}`;
  return {
    equation,
    result,
    priority: operator.priority
  }
}

export function questionGenerator(maxResult = 9, minResult = 1, maxLength = 10, minLength = 6) {
  let answer;
  do {
    answer = randomInt(maxResult + 1, minResult);
  } while (minLength <= 6 && answer === 0);
  while (true) {
    const e1 = secondEquationGenerator(answer);
    const e2 = secondEquationGenerator(answer);
    const question = `${e1.equation}=${e2.equation}`;
    if (e1.equation !== e2.equation && question.length <= maxLength && question.length >= minLength) return question;
  };
}

function calc(str) {
  const arr = str.split("");
  const left = arr.countWhere(c => c === "(");
  const right = arr.countWhere(c => c === ")");
  if (left !== right) return NaN;
  // It is the worst way, but maybe it can't cause bugs.
  try {
    const result = eval(str.replace(/×/g, "*")
    .replace(/\d+/g, match => parseInt(match, 10).toString())
    .replace(/\^/g, "**").replace(/--/g, "+"));
    if (!Number.isFinite(result) || Number.isNaN(result)) return NaN;
    return Math.round(result * 1e8) / 1e8;
  } catch (e) {
    console.log(e);
    return NaN;
  }
}

function checkRow(row) {
  if (row.countWhere(c => c === "=") !== 1) return false;
  const str = row.join("");
  const split = str.split("=");
  if (str.includes("××")) return false;
  return calc(split[0]) === calc(split[1]);
}

function fill(x, l) {
  return Array.repeat("", l).map((c, i) => x[i] ?? c);
}

const enter = "[✓]";

export default {
  name: "LC3HelpModal",
  components: {
    ModalWrapperChoice,
    PrimaryButton,
    SliderComponent
  },
  data() {
    return {
      question: "",
      blockRows: [[]],
      currentRow: 0,
      count: 0,
      state: GAME_STATE.NOT_COMPLETE,
      maxResult: 9,
      minResult: 1,
      maxLength: 10,
      minLength: 6,
      row: 6,
      notify: null
    }
  },
  computed: {
    inputRows() {
      return [
        ["0", "1", "2", "3", "4", "+", "-", "(", ")", "Del"],
        ["5", "6", "7", "8", "9", "×", "/", "=", "^", enter]
      ]
    },
    lc3Running() {
      return LC3.isRunning;
    },
    len() {
      return this.question.length;
    },
    isCompleted() {
      return this.state === GAME_STATE.COMPLETED;
    },
    isFailed() {
      return this.state === GAME_STATE.FAILED;
    },
    title() {
      if (!this.lc3Running) return "LC3 Mini-game";
      return "Boost Upgrades";
    },
    sliderProps() {
      return {
        interval: 1,
        width: "100%",
        tooltip: false,
        valueInDot: true,
        "dot-class": "c-exchange__slider-handle",
        "bg-class": "c-exchange__slider-bg",
        "process-class": "c-exchange__slider-process"
      };
    }
  },
  watch: {
    maxResult(newValue) {
      if (this.lc3Running) return;
      player.lc3Game.options.maxResult = Math.max(newValue, player.lc3Game.options.minResult);
    },
    minResult(newValue) {
      if (this.lc3Running) return;
      player.lc3Game.options.minResult = Math.min(newValue, player.lc3Game.options.maxResult);
    },
    maxLength(newValue) {
      if (this.lc3Running) return;
      player.lc3Game.options.maxLength = Math.max(newValue, player.lc3Game.options.minLength);
    },
    minLength(newValue) {
      if (this.lc3Running) return;
      player.lc3Game.options.minLength = Math.min(newValue, player.lc3Game.options.maxLength);
    },
    row(newValue) {
      if (this.lc3Running) return;
      player.lc3Game.options.row = newValue;
    }
  },
  methods: {
    input(x) {
      if (this.state !== GAME_STATE.NOT_COMPLETE) return;
      let row = this.blockRows[this.currentRow];
      if (!row) {
        this.state = GAME_STATE.FAILED;
        player.lc3Game.state = this.state;
        return;
      }
      const rowTrim = row.filter(r => r !== "");
      ++this.count;
      if (x === enter) {
        if (rowTrim.length !== this.len) {
          this.showNotify("The length is too short");
          return;
        };
        if (!checkRow(rowTrim)) {
          this.showNotify("The equation is incorrect.");
          return;
        };
        if (row.join("") === this.question) {
          this.state = GAME_STATE.COMPLETED;
          player.lc3Game.state = this.state;
          return;
        }
        if (this.currentRow + 1 >= this.row) {
          this.state = GAME_STATE.FAILED;
          player.lc3Game.state = this.state;
          return;
        }
        ++this.currentRow;
        ++player.lc3Game.currentRow;
        return;
      }
      if (x === "Del") {
        if (rowTrim.length === 0) return;
        rowTrim.pop();
        row = fill(rowTrim, this.len);
        this.blockRows[this.currentRow] = row;
        player.lc3Game.rows[this.currentRow] = row.slice();
        return;
      }
      if (rowTrim.length === this.len) return;
      rowTrim.push(x);
      row = fill(rowTrim, this.len);
      this.blockRows[this.currentRow] = row;
      player.lc3Game.rows[this.currentRow] = row.slice();
    },
    id(a, b) {
      return 5 * a + b;
    },
    showNotify(text) {
      this.notify = text;
    },
    hideNotify() {
      this.notify = null;
    },
    getBlockClass(char, row, a, b) {
      if (this.currentRow <= a - (this.state === GAME_STATE.NOT_COMPLETE ? 0 : 1)) return;
      if (char === this.question[b]) return "c-game-block--good";
      if (row.countWhere((c, i) => c === char && c === this.question[i]) +
        row.slice(0, b)
        .countWhere((c, i) => c === char && c !== this.question[i]) <
        this.question.split("")
        .countWhere(c => c === char)
      ) {
        return "c-game-block--mistake";
      }
      return "c-game-block--bad";
    },
    getInputClass(char) {
      if (char === "Del" || char === enter) return;
      let isGray = false;
      const completedRows = this.blockRows.slice(0, this.currentRow);
      for (let i = completedRows.length - 1; i >= 0 ; i--) {
        const row = completedRows[i];
        for (let idx = row.length - 1; idx >= 0; idx--) {
          if (row[idx] !== char) continue;
          const btnClass = this.getBlockClass(char, row, i, idx);
          if (btnClass === "c-game-block--bad") {
            isGray = true;
            continue;
          }
          return btnClass;
        }
      };
      return isGray ? "c-game-block--bad" : void 0;
    },
    restart() {
      LC3.game.reset();
      this.init();
      console.log(this.state, this.blockRows);
    },
    init() {
      if (!this.lc3Running) {
        const options = player.lc3Game.options;
        this.maxResult = options.maxResult;
        this.minResult = options.minResult;
        this.maxLength = options.maxLength;
        this.minLength = options.minLength;
        this.row = options.row;
      }
      if (player.lc3Game.rows) {
        this.question = player.lc3Game.question;
        this.blockRows = player.lc3Game.rows.map(r => [].slice.call(r));
        this.currentRow = player.lc3Game.currentRow;
        this.state = player.lc3Game.state;
      } else {
        this.currentRow = 0;
        if (
          this.minResult === this.maxResult && this.minResult === 0 &&
          this.minLength === this.maxLength && this.maxLength === 6
        ) {
          this.showNotify(`Cannot start with the options with a minimum result of 0 and a length less than 6.`);
          return;
        }
        this.question = questionGenerator(this.maxResult, this.minResult, this.maxLength, this.minLength);
        this.blockRows = Array.range(0, this.row).map(() => Array.repeat("", this.len));
        this.state = GAME_STATE.NOT_COMPLETE;
        player.lc3Game.question = this.question;
        player.lc3Game.rows = this.blockRows.map(r => [].slice.call(r));
        player.lc3Game.currentRow = 0;
        player.lc3Game.state = GAME_STATE.NOT_COMPLETE;
      }
    },
    adjustSliderValue(value, name) {
      this[name] = value;
    },
  },
  created() {
    this.init();
  },
  template: `
  <ModalWrapperChoice
    :key="count + 'ct'"
    :showConfirm="isCompleted"
    :showCancel="isFailed"
    class="l-lc3-modal"
  >
    <template #header>
      {{ title }}
    </template>
    <div
      class="c-game-container"
      @click="hideNotify"
    >
      <transition name="a-game-notify-modal">
        <div
          v-if="notify"
          class="l-game-notify-modal"
        >
          {{ notify }}
          <br>
          (Click to hide)
        </div>
      </transition>
      <div
        class="c-game-block-row"
        v-for="(row, index) in blockRows"
        :key="index"
      >
        <div
          class="c-game-block"
          :class="getBlockClass(char, row, index, idx)"
          v-for="(char, idx) in row"
          :key="id(index, idx)"
        >
          {{ char }}
        </div>
      </div>
      <br>
      <div
        class="c-game-block-row"
        v-for="(row, index) in inputRows"
        :key="index + 'ipt'"
      >
        <div
          class="c-game-block c-game-block--small"
          :class="getInputClass(char)"
          v-for="(char, idx) in row"
          :key="\`\${id(index, idx)}\${count}ipt\`"
          @click.stop="input(char)"
        >
          {{ char }}
        </div>
      </div>
      <div
         v-if="!lc3Running"
        class="c-game-options-container"
      >
        <b>Game Options (Invalid in LC3)</b>
        <PrimaryButton
          class="c-restart-game-btn"
          @click.stop="restart"
        >
          Restart
        </PrimaryButton>
        <div class="c-game-options-progress-bar">
          <div>
            <div>Min Length:</div>
            <div>Max Length:</div>
            <div>Min Result:</div>
            <div>Max Result:</div>
            <div>Rows :</div>
          </div>
          <div>
            <div>
              <SliderComponent
                v-bind="sliderProps"
                :value="minLength"
                :min="6"
                :max="15"
                @input="adjustSliderValue($event, 'minLength')"
              />
            </div>
            <div>
              <SliderComponent
                v-bind="sliderProps"
                :value="maxLength"
                :min="6"
                :max="15"
                @input="adjustSliderValue($event, 'maxLength')"
              />
            </div>
            <div>
              <SliderComponent
                v-bind="sliderProps"
                :value="minResult"
                :min="0"
                :max="30"
                @input="adjustSliderValue($event, 'minResult')"
              />
            </div>
            <div>
              <SliderComponent
                v-bind="sliderProps"
                :value="maxResult"
                :min="0"
                :max="30"
                @input="adjustSliderValue($event, 'maxResult')"
              />
            </div>
            <div>
              <SliderComponent
                v-bind="sliderProps"
                :value="row"
                :min="3"
                :max="8"
                @input="adjustSliderValue($event, 'row')"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </ModalWrapperChoice>
  `
};