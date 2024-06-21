import ModalWrapperChoice from "./ModalWrapperChoice.js";

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
      const b = randomInt(20);
      const a = b + r;
      return [a, b];
    },
    canGen: () => true,
    priority: 0
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
    priority: 1
  },
  {
    name: "÷",
    fn: (a, b) => a / b,
    priority: 1,
    genBase: r => {
      const b = randomInt(8) + 2;
      const a = b * r;
      return [a, b];
    },
    canGen: r => r > 0,
  },
  {
    name: "^",
    fn: (a, b) => Math.pow(a, b),
    priority: 2,
    genBase: r => {
      if (Number.isInteger(Math.sqrt(r))) return [Math.sqrt(r), 2];
      if (Number.isInteger(Math.cbrt(r))) return [Math.cbrt(r), 2];
    },
    canGen: r => {
      return Number.isInteger(Math.sqrt(r)) || Number.isInteger(Math.cbrt(r));
    },
  }
];

const randomInt = x => Math.floor(Math.random() * x);
const randomIn = x => Math.random() < 1 / x;

function baseEquationGenerator(canOnlyNumber = false, answer = randomInt(10)) {
  if (canOnlyNumber && Math.random() > 0.1) {
    return {
      equation: answer.toString(),
      result: answer,
      priority: Number.MAX_VALUE * Math.sign(answer)
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

function secondEquationGenerator(answer = randomInt(10)) {
  if (Math.random() < 0.1) {
    return {
      equation: answer.toString(),
      result: answer,
      priority: Number.MAX_VALUE * Math.sign(answer)
    }
  }
  let operator = operators.randomElement();
  while (!operator.canGen(answer)) {
    operator = operators.randomElement();
  }
  const number = operator.genBase(answer);
  const base1 = baseEquationGenerator(true, number[0]);
  if (operator.priority > base1.priority) {
    base1.equation = formatBracket(base1.equation);
  }
  const base2 = baseEquationGenerator(true, number[1]);
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

function questionGenerator() {
  const answer = randomInt(9) + 1;
  let question;
  do {
    const  e1  = secondEquationGenerator(answer);
    const  e2  = secondEquationGenerator(answer);
    question = `${e1.equation}=${e2.equation}`;
  } while (question.length > 10 || question.length < 5);
  return question;
}

function checkRow(row) {
  if (row.countWhere(c => c === "=") !== 1) return false;
  const left = row.countWhere(c => c === "(");
  const right = row.countWhere(c => c === ")");
  if (left !== right) return false;
  // It is the worst way, but maybe it can't cause bugs.
  try {
    return eval(row.join("").replace("=", "===").replace(/×/g, "*").replace(/÷/g, "/")
    .replace(/\d+/g, match => parseInt(match, 10).toString())
    .replace(/\^/g, "**"));
  } catch (e) {
    console.log(e);
    return false;
  }
}

function fill(x, l) {
  return Array.repeat("", l).map((c, i) => x[i] ?? c);
}

const enter = "[✓]";

export default {
  name: "LC3HelpModal",
  components: {
    ModalWrapperChoice
  },
  data() {
    return {
      question: "",
      answer: false,
      blockRows: [[]],
      currentRow: 0,
      count: 0,
      state: GAME_STATE.NOT_COMPLETE
    };
  },
  computed: {
    inputRows() {
      return [
        ["0", "1", "2", "3", "4", "+", "-", "(", ")", "Del"],
        ["5", "6", "7", "8", "9", "×", "÷", "=", "^", enter]
      ]
    },
    len() {
      return this.question.length;
    },
    isCompleted() {
      return this.state === GAME_STATE.COMPLETED;
    },
    isFailed() {
      return this.state === GAME_STATE.FAILED;
    }
  },
  watch: {
    state(newValue) {
      player.lc3Game.state = newValue;
    },
  },
  methods: {
    input(x) {
      if (this.state !== GAME_STATE.NOT_COMPLETE) return;
      let row = this.blockRows[this.currentRow];
      const rowTrim = row.filter(r => r !== "");
      ++this.count;
      if (x === enter) {
        if (rowTrim.length !== this.len) return false;
        if (!checkRow(rowTrim)) return;
        if (row.join("") === this.question) {
          this.state = GAME_STATE.COMPLETED;
          return;
        }
        if (this.currentRow >= 6) {
          this.state = GAME_STATE.FAILED;
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
    getBlockClass(char, row, a, b) {
      if (this.currentRow <= a && this.state === GAME_STATE.NOT_COMPLETE) return;
      if (char === this.question[b]) return "c-game-block--good";
      const noGreen = row.filter((c, i) => c === char && c === this.question[i]);
      if (noGreen.length +
        row.slice(0, b + 1)
        .countWhere((c, i) => c === char && c !== this.question[i]) >
        this.question.split("")
        .countWhere(c => c === char)
      ) {
      return "c-game-block--bad";
      }
      return "c-game-block--mistake";
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
    }
  },
  created() {
    if (player.lc3Game.rows) {
      this.question = player.lc3Game.question;
      this.blockRows = player.lc3Game.rows.map(r => [].slice.call(r));
      this.currentRow = player.lc3Game.currentRow;
    } else {
      this.question = questionGenerator();
      this.blockRows = Array.range(0, 6).map(() => Array.repeat("", this.len));
      this.currentRow = 0;
      player.lc3Game.question = this.question;
      player.lc3Game.rows = this.blockRows.map(r => [].slice.call(r));
      player.lc3Game.currentRow = 0;
    }
  },
  template: `
  <ModalWrapperChoice
    :key="count + 'ct'"
    :showConfirm="isCompleted"
    :showCancel="isFailed"
  >
    <template #header>
      Complete the game to gain a multiplier
    </template>
    <div class="c-game-container">
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
      <div
        class="c-game-block-row"
        v-for="(row, index) in inputRows"
        :key="index + 'ipt'"
      >
        <div
          class="c-game-block c-game-block--small"
          :class="getInputClass(char)"
          v-for="(char, idx) in row"
          :key="id(index, idx) + 'ipt'"
          @click="input(char)"
        >
          {{ char }}
        </div>
      </div>
    </div>
  </ModalWrapperChoice>
  `
};