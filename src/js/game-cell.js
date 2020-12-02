import $ from 'jquery';

export const StatusCell = {
  NOT_ACTIVE: `not-active`,
  SELECT: `select`,
};

/**
 * Класс для создания игровых ячеек
 */
export default class GameCell {
  /**
   * Метод запуска конструктора инициализирующий базовую конфигурацию ячейки
   * 
   * @param {object} param0 - объект с конфигурацией для ячейки
   */
  constructor({
      number,
      status = StatusCell.NOT_ACTIVE,
      selectAction = () => {},
      isWinner = false
    }) {
    this.number = number;
    this.status = status;
    this.cell = GameCell.config.cell;
    this.selectAction = selectAction;
    this.isWinner = isWinner;

    this.init();
  }

  /**
   * Инициализация элемента
   */
  init() {
    this.element = $(this.cell).append(this.number);
    this.element.on(`click`, this.onSelect.bind(this));
  }

  /**
   * Получение jquery объекта элемента
   * 
   * @return {object} - jquery объект с элементом ячейки
   */
  getElement() {
    return this.element;
  }

  /**
   * Установка статуса ячейки
   * 
   * @param {string} status - новый статус ячейки
   */
  setStatus(status) {
    this.status !== StatusCell.SELECT && this.element.addClass(`${GameCell.config.cellSelectedClass}`);
    this.status = status;
  }

  /**
   * Обработчик события при нажатии на элемент
   */
  onSelect() {
    !this.selectAction() && this.setStatus(StatusCell.SELECT);
  }

  /**
   * Установка необходимых конфигурация для класса
   * 
   * @param {object} config - объект конфигурации
   */
  static setConfig(config) {
    GameCell.config = config;
  }
}
