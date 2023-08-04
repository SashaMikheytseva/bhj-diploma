/**
 * Класс TransactionsWidget отвечает за
 * открытие всплывающих окон для
 * создания нового дохода или расхода
 * */

class TransactionsWidget {
  /**
   * Устанавливает полученный элемент
   * в свойство element.
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */
  constructor( element ) {
    this.element = element;

    if (!element) {
      throw new Error("The element doesn't exist");
    }
    this.registerEvents();
  }
  /**
   * Регистрирует обработчики нажатия на
   * кнопки «Новый доход» и «Новый расход».
   * При нажатии вызывает Modal.open() для
   * экземпляра окна
   * */
  registerEvents() {
    this.element.addEventListener('click', (e) => {
      let target = e.target;
      if (target.closest('.create-income-button')) {
        App.getModal('newIncome').open();
      }
      if (target.closest('.create-expense-button')) {
        App.getModal('newExpense').open();
      }
    });
  }
}
