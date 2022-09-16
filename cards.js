'use strict';
import Card from './class/card_class.js';

let cards = [];
let books = [];
let visitors = [];
let date_now =new Date;
class CardPage{
    constructor() {
        this.wrap = document.querySelector('.wrapper');
        this.form = document.querySelector('.form');
        this.input = this.form.querySelectorAll('input');
        this.count = 1;
        this.del_edit = 0;
        this.highlight = false;
        this.edit = false;
        this.del_visitor = '';
        this.del_book = '';
    }

    card_click_wrap(even) {//функція відстеження кліку по сторінці
        if (even.target.className == 'button_add') {
            this.card_form_add_show();//виклик функції відкриття фоми
        }
        if (even.target.className == 'return') {
            this.card_return_book(even.path);//виклик функції повернення книги
        }
        if (even.target.className == 'button_sort') {
            this.card_sort();// виклик функції сортування
        }
    }
    card_click_form(even) {
        if (even.target.className == 'button_save') {
               this.card_add_save(); // виклик функції додавання картки
        }
        if (even.target.tagName == 'SPAN') {
            this.card_form_close();// виклик функції закриття форми
        }
        if (even.target.className == 'button_error') {
            this.form.querySelector('.error').style.display = 'none';
        }
    }
    card_form_add_show() {//функція відкриття форми
        this.form.style.display = 'flex';
        this.wrap.style.opacity = '0.1';
        this.load_books_localStorage();//виклик фунуції завантаження данних про книги з localStorage 
        this.load_visitors_localStorage();//виклик фуеуції завантаження данних про відвідувачів з localStorage
        this.card_form_add_books_list();//виклик функції додавання до форми списку книг для видачі
        this.card_form_add_visitors_list();//виклик функції додавання до форми списку відвідувачів 
    }
    card_form_add_books_list() {//функція додавання до форми списку книг для видачі
        books.forEach((item) => {
            if (item.amount >= 1) {
                let code = `<option value="${item.name}">${item.name}</option>`;
                this.form.querySelector('#book').insertAdjacentHTML('beforeend', code);
            }
        });
    }
    card_form_add_visitors_list() {//функція додавання до форми списку відвідувачів
        visitors.forEach((item) => {
                let code = `<option value="${item.fio}">${item.fio}</option>`;
                this.form.querySelector('#visitor').insertAdjacentHTML('beforeend', code);
        });
    }
    card_form_close() {//функція закриття форми
        this.form.style.display = 'none';
        this.wrap.style.opacity = '1.0';
        this.form.querySelector('#visitor').innerHTML= '';
        this.form.querySelector('#book').innerHTML= '';
    }
    card_add_save() {//функція додавання картки
        let valid_flag = true;
        for (let i = 0; i<this.input.length-1; i++)
        {
            if (this.input[i].classList.contains('invalid')) {
                this.input[i].classList.remove('invalid');
            }
            if (this.input[i].value == '') {
                this.input[i].classList.add('invalid');
                valid_flag = false;
            }
        }
        if (!valid_flag) {
            this.form.querySelector('.error').style.display = 'block';
            return;
        }
        let card = new Card();
        card = {
            id: this.count,
            fio_visitor: `${this.form.querySelector('#visitor').value}`,
            name_book: `${this.form.querySelector('#book').value}`,
            take_book: `${date_now.getDay()+"."+date_now.getMonth()+"."+date_now.getFullYear()}`,
            return_book: ``,
        };
        this.load_books_localStorage();//виклик фунуції завантаження данних про книги з localStorage 
        this.load_visitors_localStorage();//виклик фуеуції завантаження данних про відвідувачів з localStorage
        visitors.forEach((item) => {
            if (item.fio == card.fio_visitor) {
                item.count++;
            }
        });
        books.forEach((item) => {
            if (item.name == card.name_book) {
                item.amount--;
                item.count++;
                console.log(item.amount);
            }
        })
        cards.push(card);
        this.input.forEach((even) => {
            even.value = '';
        })
        this.save_books_localStorage();//виклик функції збереження данних про книги в localStorage
        this.save_visitors_localStorage();//виклик функції збереження данних про відвідувачів localStorage
        this.save_localStorage();//виклик функції збереження в localStorage
        this.card_table_show(card);// виклик функції виведення на єкран доданої картки
        this.form.style.display = 'none';
        this.wrap.style.opacity = '1.0';
        this.form.querySelector('#visitor').innerHTML= '';
        this.form.querySelector('#book').innerHTML= '';
        this.count++;
    }
    card_table_show(even) {//функція виведення на єкран картки
            this.code = `
                <tr>
                    <td>${even.id}</td>
                    <td>${even.fio_visitor}</td>
                    <td>${even.name_book}</td>
                    <td>${even.take_book}</td>`
        if (even.return_book != '') {
            this.code += `<td>${even.return_book}</td>
                </tr>`;
        }
        else {
            this.code += `<td><button class="return">return</button></td>
                </tr>`;
        }
                    
        document.querySelector('table').insertAdjacentHTML('beforeend', this.code);
        this.count++;
    }
    card_return_book(even) {//функція повернення книги
        even.innerHTML = `${date_now.getDay() + "." + date_now.getMonth() + "." + date_now.getFullYear()}`;
        cards.forEach((item) => {
            if (item.fio_visitor == even[2].childNodes[3].innerText) {
                item.return_book = date_now.getDay() + "." + date_now.getMonth() + "." + date_now.getFullYear();
                
            }
        });
        books.forEach((item) => {
            if (item.name == even[2].childNodes[5].innerText) {
                item.amount++;
            }
        });
        this.save_books_localStorage();//виклик функції збереження данних про книги в localStorage
        this.save_localStorage();//виклик функції збереження в localStorage
        this.card_table_review();//виклик функції оновлення данних таблиці 
    }
    
    card_table_review() {//функція оновлення данних таблиці 
        let table = this.wrap.querySelectorAll('table tbody');
            for (let i = 1; i < table.length; i++) {
                table[i].remove();
            }
        this.count = 1;
            cards.forEach((item) => {
                item.id = this.count++;
                this.card_table_show(item)//виклик функції виведення на єкран картки
            });
    }
    card_search() {// функція пошуку
        let search_text = this.wrap.querySelector('.search_text').value.toUpperCase().trim();
        let tr = this.wrap.querySelectorAll('tr');
        let serch_flag;
        if (search_text != '') {
            for (let i = 1; i < tr.length; i++) {
                serch_flag = false;
                let td = tr[i].querySelectorAll('td');
                for (let j = 0; j < td.length-2; j++) {
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

    card_sort() {//функція сортування
        let sort_text = this.wrap.querySelector('.sort_text').value;
        switch (sort_text) {
            case 'Full name visitor 0-9': {
                cards.sort((a, b) => {
                    if (a.fio_visitor > b.fio_visitor) {
                        return 1;
                    }
                    if (a.fio_visitor < b.fio_visitor) {
                        return -1;
                    }
                    return 0;
                });
                break;
            }
            case 'Full name visitor 9-0': {
                cards.sort((a, b) => {
                    if (a.fio_visitor < b.fio_visitor) {
                        return 1;
                    }
                    if (a.fio_visitor > b.fio_visitor) {
                        return -1;
                    }
                    return 0;
                });
                break;
            }
            case 'Name book 0-9': {
                cards.sort((a, b) => {
                    if (a.name_book > b.name_book) {
                        return 1;
                    }
                    if (a.name_book < b.name_book) {
                        return -1;
                    }
                    return 0;
                });
                break;
            }
            case 'Name book 9-0': {
                cards.sort((a, b) => {
                    if (a.name_book < b.name_book) {
                        return 1;
                    }
                    if (a.name_book > b.name_book) {
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
        this.card_table_review();//виклик функції оновлення данних таблиці 
    }
    save_localStorage() {//функція збереження в localStorage данних про картку
        visitors.sort(( a, b ) =>  a.id - b.id);
        localStorage.setItem('Cards', JSON.stringify(cards));
    }
    load_localStorage() {//функція завантаження данних про картку з localStorage
        if (localStorage.getItem('Cards') != null) {
            cards = JSON.parse(localStorage.getItem('Cards'));
            cards.forEach((item) => {
                this.count = item.id;
                this.card_table_show(item)
            });
        }
    }
    load_books_localStorage() {//фунуція завантаження данних про книги з localStorage 
        if (localStorage.getItem('Books') != null) {
            books = JSON.parse(localStorage.getItem('Books'));
        }    
    }
    load_visitors_localStorage() {//фунуція завантаження данних про відвідувачів з localStorage 
        if (localStorage.getItem('Visitors') != null) {
            visitors = JSON.parse(localStorage.getItem('Visitors'));
        }
    }
    save_books_localStorage() {//фунуція збереження данних про книги з localStorage 
        localStorage.setItem('Books', JSON.stringify(books));
    }
    save_visitors_localStorage() {//фунуцяї збереження данних про відвідувачів з localStorage 
        localStorage.setItem('Visitors', JSON.stringify(visitors));
    }

    init() {
        this.wrap.addEventListener('click', this.card_click_wrap.bind(this));//підкючення відстеження кліку по сторінці
        this.form.addEventListener('click', this.card_click_form.bind(this));//підкючення відстеження кліку по формі
        this.wrap.querySelector('.search_text').addEventListener('input', this.card_search.bind(this));//підключення введення данних в рядок пошуку
        this.load_localStorage();//виклик функції  завантаження данних про картку з localStorage
    }
}
let cardPage = new CardPage();
cardPage.init();







