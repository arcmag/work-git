import $ from 'jquery';
import GameCell, { StatusCell } from './game-cell';

const DELAY_OPEN_ANIMATE = 500;

const MAX_GAME_CELL = 36;
const MAX_OPEN_CELL = 6;

const PrizeList = {
  0: 0,
  1: 20000,
  2: 50000,
  3: 125000,
  4: 250000,
  5: 500000,
  6: 1000000,
};

/**
 * Основной класс управляющий общим состоянием игры
 */
export default class Game {
  /**
   * Метод запуска конструктора инициализирующий базовую конфигурацию игры
   * 
   * @param {object} config - объект с конфигурацией данных для игры
   */
  constructor(config) {
    this._config = config;
    this.checkSelectCellCondition = this.checkSelectCellCondition.bind(this);
    this._wrapper = $(this._config.wrapper);
    $(this._config.container).append(this._wrapper);
  }

  /**
   * Создание коллекции ячеек в количестве равном MAX_GAME_CELL и
   * перемешивании их в рандомном порядке
   */
  createCellList() {
    this.cells = Array.from({ length: MAX_GAME_CELL }, (_it, idx) => new GameCell({
      number: idx + 1, selectAction: this.checkSelectCellCondition }));
  }

  /**
   * Установка случайных победных чисел
   */
  setWinnerCell() {
    this.cells
      .slice()
      .sort(() => Math.random() - 0.5)
      .slice(0, MAX_OPEN_CELL)
      .forEach(it => it.isWinner = true);
  }

  /**
   * Получить список ячеек с угаданными числами
   *
   * @return {GameCell[]} - список ячеек с угаданными числами
   */
  getGuessedCellList(winnerNumbers) {
    return this.cells.filter(it => it.status === StatusCell.SELECT &&
      winnerNumbers.includes(it.number));
  }

  /**
   * Получить количество выбранных на доске ячеек
   * 
   * @return {int} - количество открытых на доске ячеек
   */
  getOpenCellCount() {
    return this.cells.reduce((count, { status }) => (count + (status === StatusCell.SELECT ? 1 : 0)), 0);
  }

  /**
   * Получить результат проверки условия выбора максимального количества ячеек
   *
   * @return {boolean} - результат условия
   */
  checkSelectCellCondition() {
    return this.getOpenCellCount() >= MAX_OPEN_CELL;
  }

  /**
   * Перерисовать ячейки на доске
   */
  render() {
    this._wrapper.empty();
    this.cells.forEach((cell) => this._wrapper.append(cell.getElement()));
  }

  /**
   * Добавить все необходимые для управления игрой обработчики событий
   */
  addListeners() {
    $(this._config.btnReset).on(`click`, () => (this.getOpenCellCount() > 0) && this.start());
    $(this._config.btnFinish).on(`click`, this.onFinish.bind(this));
  }

/**
 * Обновление всех данных и перерисовка ячеек на доске
 */
  async start() {
    this.createCellList();
    this.setWinnerCell();
    this.render();
  }

  /**
   * Обработчик завершения игры
   */
  async onFinish() {
    if (this.getOpenCellCount() < MAX_OPEN_CELL) {
      return alert(`Что бы завершить игру, надо открыть как минимум ${MAX_OPEN_CELL} ячеек!`);
    }

    const winnerNumbers = [];
    for (const cell of this.cells.filter(it => it.isWinner)) {
      winnerNumbers.push(
        await new Promise(resolve => setTimeout(() => {
          cell.getElement().addClass(this._config.cellWinnerClass);
          resolve(cell.number);
        }, DELAY_OPEN_ANIMATE))
      );
    }

    const result = $(this._config.result).empty()
      .append(`<p>Скрытые числа: ${winnerNumbers}.</p>`);
    const guessedNumbers = this.getGuessedCellList(winnerNumbers);
    if (guessedNumbers.length > 0) {
      result
        .append(`<p>Вы угадали следующие: ${guessedNumbers.map(it => it.number)}!</p>`)
        .append(`<p>Ваш итоговый счет - ${guessedNumbers.length} что равняется выигрышу в ${PrizeList[guessedNumbers.length]}$!</p>`);
    } else {
      result.append(`<p>Вы не угадали ни одного числа, и ничего не выиграли :(((</p>`);
    }
  }

  /**
   * Статичный метод для запуска кода игры
   * 
   * @param {object} config - объект с конфигурацией данных для игры
   */
  static start(config) {
    const game = new Game(config);
    GameCell.setConfig(config);
    game.start();
    game.addListeners();
  }
}
