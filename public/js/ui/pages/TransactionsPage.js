/**
 * Класс TransactionsPage управляет
 * страницей отображения доходов и
 * расходов конкретного счёта
 * */
class TransactionsPage {
  /**
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * Сохраняет переданный элемент и регистрирует события
   * через registerEvents()
   * */
  constructor( element ) {
    this.element = element;

    if (!element) {
      throw new Error("The element doesn't exist");
    }
    this.registerEvents();
  }

  /**
   * Вызывает метод render для отрисовки страницы
   * */
  update() {
    this.render(this.lastOptions);
  }

  /**
   * Отслеживает нажатие на кнопку удаления транзакции
   * и удаления самого счёта. Внутри обработчика пользуйтесь
   * методами TransactionsPage.removeTransaction и
   * TransactionsPage.removeAccount соответственно
   * */
  registerEvents() {
    this.element.addEventListener('click', (e) => {
      let target = e.target;
      if (target.closest('.remove-account')) {
        this.removeAccount();
      }
      if (target.closest('.transaction__remove')) {
        this.removeTransaction(target.closest('.transaction__remove').dataset.id);
      }
    });
  }

  /**
   * Удаляет счёт. Необходимо показать диаголовое окно (с помощью confirm())
   * Если пользователь согласен удалить счёт, вызовите
   * Account.remove, а также TransactionsPage.clear с
   * пустыми данными для того, чтобы очистить страницу.
   * По успешному удалению необходимо вызвать метод App.updateWidgets() и App.updateForms(),
   * либо обновляйте только виджет со счетами и формы создания дохода и расхода
   * для обновления приложения
   * */
  removeAccount() {
    if (!this.lastOptions) {
      return;
    }

    if (confirm('Do you really want to remove the account?')) {
      Account.remove({ id: this.lastOptions.account_id }, (err, response) => {
        if (response && response.success) {
          this.clear();
          App.updateWidgets();
          App.updateForms();
        } else {
          console.log(err);
        }
      });
    }
  }

  /**
   * Удаляет транзакцию (доход или расход). Требует
   * подтверждеия действия (с помощью confirm()).
   * По удалению транзакции вызовите метод App.update(),
   * либо обновляйте текущую страницу (метод update) и виджет со счетами
   * */
  removeTransaction(id) {
    if (confirm('Do you really want to remove this transaction?')) {
      Transaction.remove({ id }, (err, response) => {
        if (response && response.success) {
          App.update();
        } else {
          console.log(err);
        }
      });
    }
  }

  /**
   * С помощью Account.get() получает название счёта и отображает
   * его через TransactionsPage.renderTitle.
   * Получает список Transaction.list и полученные данные передаёт
   * в TransactionsPage.renderTransactions()
   * */
  render(options) {
    this.lastOptions = options;

    if (!options) {
      return;
    }

    Account.get(options.account_id, (err, response) => {
      if (response && response.success) {
        this.renderTitle(response.data.name);
      } else {
        console.log(err);
      }
    });

    Transaction.list(options, (err, response) => {
      if (response && response.success) {
        this.renderTransactions(response.data);
      } else {
        console.log(err);
      }
    });
  }

  /**
   * Очищает страницу. Вызывает
   * TransactionsPage.renderTransactions() с пустым массивом.
   * Устанавливает заголовок: «Название счёта»
   * */
  clear() {
    this.renderTransactions([]);
    this.renderTitle('Название счёта');
    this.lastOptions = null;
  }

  /**
   * Устанавливает заголовок в элемент .content-title
   * */
  renderTitle(name) {
    document.querySelector('.content-title').textContent = name;
  }

  /**
   * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
   * в формат «10 марта 2019 г. в 03:20»
   * */
  formatDate(date) {
    let currentDate = new Date(date);

    let day = currentDate.toLocaleDateString('ru', 
    {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    let time = currentDate.toLocaleTimeString('ru', 
    {
      hour: '2-digit',
      minute: '2-digit'
    });

    return `${day} в ${time}`;
  }

  /**
   * Формирует HTML-код транзакции (дохода или расхода).
   * item - объект с информацией о транзакции
   * */
  getTransactionHTML(item) {
    return `<div class="transaction transaction_${item.type} row">
              <div class="col-md-7 transaction__details">
                <div class="transaction__icon">
                    <span class="fa fa-money fa-2x"></span>
                </div>
                <div class="transaction__info">
                    <h4 class="transaction__title">${item.name}</h4>
                    <!-- дата -->
                    <div class="transaction__date">${this.formatDate(item.created_at)}</div>
                </div>
              </div>
              <div class="col-md-3">
                <div class="transaction__summ">
                <!--  сумма -->
                  ${item.sum} <span class="currency">₽</span>
                </div>
              </div>
              <div class="col-md-2 transaction__controls">
                  <!-- в data-id нужно поместить id -->
                  <button class="btn btn-danger transaction__remove" data-id="${item.id}">
                      <i class="fa fa-trash"></i>  
                  </button>
              </div>
          </div>`;
  }

  /**
   * Отрисовывает список транзакций на странице
   * используя getTransactionHTML
   * */
  renderTransactions(data) {
    const content = document.querySelector('.content');
    content.innerHTML = '';
    data.forEach((item) => {
      content.innerHTML += this.getTransactionHTML(item);
    });
  }
}