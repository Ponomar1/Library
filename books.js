'use strict';
import Book from './class/book_class.js';

let books = [];
class BookPage{
    constructor() {
        this.wrap = document.querySelector('.wrapper');
        this.form = document.querySelector('.form');
        this.input = this.form.querySelectorAll('input');
        this.count = 1;
        this.id = 1;
        this.del_edit = 0;
        this.highlight = false;
        this.edit = false;
        this.valid_flag = true;
    }

    book_click_wrap(even) {//функція відстеження кліку по сторінці
        if (even.target.className == 'button_add') {
            this.book_form_add_show();//виклик функції відкриття фоми
        }
        if (even.path[1].tagName == 'TR') {
            this.book_highlight(even.path[1]);//виклик функції виділення рядка
        }
        if (even.target.className == 'button_del') {
            this.book_delete();// виклик функції видалення
        }
        if (even.target.className == 'button_edit') {
            this.book_edit();// виклик функції редагування
        }
        if (even.target.className == 'button_sort') {
            this.book_sort();// виклик функції сортування
        }
    }
    book_click_form(even) {//функція відстеження кліку по формі
        if (even.target.className == 'button_save') {
            if (this.edit == false) {
               this.book_add_save();// виклик функції додавання книги
            }
            else {
                this.book_edit_save();// виклик функції редагування книги
            }
            
        }
        if (even.target.tagName == 'SPAN') {
            this.book_form_close();// виклик функції закриття форми
        }
        if (even.target.className == 'button_error') {
            this.form.querySelector('.error').style.display = 'none';
        }
    }
    book_form_add_show() {//функція відкриття форми
        this.form.style.display = 'flex';
        this.wrap.style.opacity = '0.1';
    }
    book_form_close() {//функція закриття форми
        this.form.style.display = 'none';
        this.wrap.style.opacity = '1.0';
    }
    book_add_save() {//функція додавання книги
        this.book_valid_form();// виклик функції валідації форми
        if (!this.valid_flag) {// перевірка результатів валідації
            this.form.querySelector('.error').style.display = 'block';
            return;
        }
        let book = new Book();
        book = {
            id: this.id,
            name: `${this.input[0].value}`,
            fio: `${this.input[1].value}`,
            year: `${this.input[2].value}`,
            publish: `${this.input[3].value}`,
            page: `${this.input[4].value}`,
            amount: `${this.input[5].value}`,
            count: 0
        };
        books.push(book);
        this.input.forEach((even) => {
            even.value = '';
        })
        this.save_localStorage();//виклик функції збереження в localStorage
        this.book_table_show(book);// виклик функції виведення на єкран доданої книги
        this.form.style.display = 'none';
        this.wrap.style.opacity = '1.0';
        this.id++;
    }
    book_valid_form(even) {//функція валідації форми
    this.valid_flag = true;
    this.input.forEach((item) => {
        if (item.classList.contains('invalid')) {
            item.classList.remove('invalid');
        }
    });
     this.input.forEach((item) => {
        let reg = /\d/g;
         if (item.id == 'name') {
            if (reg.test(item.value) || item.value == '' ) {
                    this.valid_flag = false;
                    item.classList.add('invalid');
                };
         }
         if (item.id == 'year') {
             reg = /^[0-9]{3}/g;
            if (!reg.test(item.value) || item.value == '' ) {
                    this.valid_flag = false;
                    item.classList.add('invalid');
                };
         }
         if (item.id == 'publishing') {
             reg = /^[a-zA-Z]/g;
            if (!reg.test(item.value) || item.value == '' ) {
                    this.valid_flag = false;
                    item.classList.add('invalid');
                };
         }
         if (item.id == 'pages') {
             reg = /\D/g;
            if (reg.test(item.value) || item.value == '' ) {
                    this.valid_flag = false;
                    item.classList.add('invalid');
                };
         }
         if (item.id == 'amount') {
             reg = /\D/g;
            if (reg.test(item.value) || item.value == '' ) {
                    this.valid_flag = false;
                    item.classList.add('invalid');
                };
         }
        });
    }
    book_table_show(even) {//функція виведення на єкран книги
            this.code = `
                <tr>
                    <td>${this.count}</td>
                    <td>${even.name}</td>
                    <td>${even.fio}</td>
                    <td>${even.year}</td>
                    <td>${even.publish}</td>
                    <td>${even.page}</td>
                    <td>${even.amount}</td>
                </tr>`;
        document.querySelector('table').insertAdjacentHTML('beforeend', this.code);
        this.count++;
    }
    book_highlight(even) {//функція виділення рядка
        if (even.children[0].innerText != '№') {
            if (!even.classList.contains('active') && this.highlight == false) {
                even.classList.add('active');
                this.del_edit = even.children[0].innerText;
                this.highlight = true;
            }
            else {
                if (even.classList.contains('active')) {
                    even.classList.remove('active');
                    this.del_edit = 0;
                    this.highlight = false;
                }
            }
        }
    }
    book_delete() {//функція видалення книги
        if (this.del_edit != 0) {
            let i = 0;
            for (i = 0; i < books.length; i++) {
                if (books[i].id == this.del_edit) {
                    break;
                }
            }
            books.splice((i - 1), 1)
            this.book_table_review();//виклик функції оновлення данних таблиці 
            this.save_localStorage();//виклик функції збереження в localStorage
            this.highlight = false;
        }
    }
    book_table_review() {//функція оновлення данних таблиці 
        let table = this.wrap.querySelectorAll('table tbody');
            for (let i = 1; i < table.length; i++) {
                table[i].remove();
            }
        this.count = 1;
            books.forEach((item) => {
                this.book_table_show(item)//виклик функції виведення на єкран книги
            });
    }
    book_edit() {//функція заповнення форми для редагування
        this.edit = true;
        if (this.del_edit != 0) {
            books.forEach((item)=>{
                if (item.id == this.del_edit) {
                    this.book_form_add_show();//виклик функції відкриття форми
                    this.input[0].value = item.name;
                    this.input[1].value = item.fio;
                    this.input[2].value = item.year;
                    this.input[3].value = item.publish;
                    this.input[4].value = item.page;
                    this.input[5].value = item.amount;
                }
            })
        }
    }
    book_edit_save() {//функція збереження редагованих данних
        for (let i = 0; i < books.length;i++){
            if (books[i].id == this.del_edit) {
                books[i].name = this.input[0].value;
                books[i].fio = this.input[1].value;
                books[i].year = this.input[2].value;
                books[i].publish = this.input[3].value;
                books[i].page = this.input[4].value;
                books[i].amount = this.input[5].value;
            }
        }
        this.input.forEach((even) => {
            even.value = '';
        })
        this.save_localStorage();//виклик функції збереження в localStorage
        this.book_table_review();//виклик функції оновлення данних таблиці 
        this.form.style.display = 'none';
        this.wrap.style.opacity = '1.0';
        this.edit = false;
        this.highlight = false;
    }
    book_search() {// функція пошуку
        let search_text = this.wrap.querySelector('.search_text').value.toUpperCase().trim();
        let tr = this.wrap.querySelectorAll('tr');
        let serch_flag;
        if (search_text != '') {
            for (let i = 1; i < tr.length; i++) {
                serch_flag = false;
                let td = tr[i].querySelectorAll('td')
                for (let j = 0; j < td.length; j++) {
                    if (td[j].innerText.toUpperCase().search(search_text) != -1) {
                        serch_flag = true;
                        break;
                    }
                }
                if (serch_flag == false) {
                    tr[i].classList.add('hide')
                }
                else {
                    tr[i].classList.remove('hide')
                }
            }
        }
        else {
            tr.forEach((item) => {
                item.classList.remove('hide');
            })
                
        }
    }

    book_sort() {//функція сортування
        let sort_text = this.wrap.querySelector('.sort_text').value;
        switch (sort_text) {
            case 'Name a-z': {
                books.sort((a, b) => {
                    if (a.name > b.name) {
                        return 1;
                    }
                    if (a.name < b.name) {
                        return -1;
                    }
                    return 0;
                });
                break;
            }
                case 'Name z-a': {
                books.sort((a, b) => {
                    if (a.name < b.name) {
                        return 1;
                    }
                    if (a.name > b.name) {
                        return -1;
                    }
                    return 0;
                });
                break;
            }
            case 'Full name a-z': {
                books.sort((a, b) => {
                    if (a.fio > b.fio) {
                        return 1;
                    }
                    if (a.fio < b.fio) {
                        return -1;
                    }
                    return 0;
                });
                break;
            }
            case 'Full name z-a': {
                books.sort((a, b) => {
                    if (a.fio < b.fio) {
                        return 1;
                    }
                    if (a.fio > b.fio) {
                        return -1;
                    }
                    return 0;
                });
                break;
            }
            case 'Year 0-9': {
                books.sort(( a, b ) =>  a.year - b.year);
                break;
            }
            case 'Year 9-0': {
                books.sort(( a, b ) =>  b.year - a.year);
                break;
            }
            case 'Publisher a-z': {
                books.sort((a, b) => {
                    if (a.publish > b.publish) {
                        return 1;
                    }
                    if (a.publish < b.publish) {
                        return -1;
                    }
                    return 0;
                });
                break;
            }
            case 'Publisher z-a': {
                books.sort((a, b) => {
                    if (a.publish < b.publish) {
                        return 1;
                    }
                    if (a.publish > b.publish) {
                        return -1;
                    }
                    return 0;
                });
                break;
            }
            default: {
                break;
            }
        }
        this.book_table_review();//виклик функції оновлення данних таблиці 
    }

    save_localStorage() {//функція збереження в localStorage
        books.sort(( a, b ) =>  a.id - b.id);
        localStorage.setItem('Books', JSON.stringify(books));
    }
    load_localStorage() {//функція завантаження данних з localStorage
        if (localStorage.getItem('Books') != null) {
            books = JSON.parse(localStorage.getItem('Books'));
            books.forEach((item) => {
                this.id = item.id;
                this.book_table_show(item);//виклик функції виведення на єкран книги
            });
            this.id++;
        }
    }
    
    init() {
        this.wrap.addEventListener('click', this.book_click_wrap.bind(this));//підкючення відстеження кліку по сторінці
        this.form.addEventListener('click', this.book_click_form.bind(this));//підкючення відстеження кліку по формі
        this.wrap.querySelector('.search_text').addEventListener('input', this.book_search.bind(this));//підключення введення данних в рядок пошуку
        this.load_localStorage();//виклик функції завантаження данних з localStorage
    }
}
let bookPage = new BookPage();
bookPage.init();



