'use strict';
import Visitor from './class/visitor_class.js'

let visitors = [];
class VisitorPage{
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
    visitor_click_wrap(even) {//функція відстеження кліку по сторінці
        if (even.target.className == 'button_add') {
            this.visitor_form_add_show();//виклик функції відкриття фоми
        }
        if (even.path[1].tagName == 'TR') {
            this.visitor_highlight(even.path[1]);//виклик функції виділення рядка
        }
        if (even.target.className == 'button_del') {
            this.visitor_delete();// виклик функції видалення
        }
        if (even.target.className == 'button_edit') {
            this.visitor_edit();// виклик функції редагування
        }
        if (even.target.className == 'button_sort') {
            this.visitor_sort();// виклик функції сортування
        }
    }
    visitor_click_form(even) {//функція відстеження кліку по формі
        if (even.target.className == 'button_save') {
            if (this.edit == false) {
               this.visitor_add_save(); // виклик функції додавання книги
            }
            else {
                this.visitor_edit_save();// виклик функції редагування відвідувача
            }
            
        }
        if (even.target.tagName == 'SPAN') {
            this.visitor_form_close();// виклик функції закриття форми
        }
        if (even.target.className == 'button_error') {
            this.form.querySelector('.error').style.display = 'none';
        }
    }
    visitor_form_add_show() {//функція відкриття форми
        this.form.style.display = 'flex';
        this.wrap.style.opacity = '0.1';
    }
    visitor_form_close() {//функція закриття форми
        this.form.style.display = 'none';
        this.wrap.style.opacity = '1.0';
    }
    visitor_add_save() {//функція додавання книги
        this.visitor_valid_form();// виклик функції валідації форми
        if (!this.valid_flag) {// перевірка результатів валідації
            this.form.querySelector('.error').style.display = 'block';
            return;
        }
        let visitor = new Visitor();
        visitor = {
            id: this.id,
            fio: `${this.input[0].value}`,
            tel: `${this.input[1].value}`,
            count: 0
        };
        visitors.push(visitor);
        this.input.forEach((even) => {
            even.value = '';
        })
        
        this.save_localStorage();//виклик функції збереження в localStorage
        this.visitor_table_show(visitor);// виклик функції виведення на єкран доданого відвідувача
        this.form.style.display = 'none';
        this.wrap.style.opacity = '1.0';
        this.id++;
    }
    visitor_valid_form() {//функція валідації форми
        this.valid_flag = true;
        this.input.forEach((item) => {
            if (item.classList.contains('invalid')) {
                item.classList.remove('invalid');
            }
        });
        this.input.forEach((item) => {
            if (item.id == 'fio') {
                let reg = /\d/g;
                if (reg.test(item.value) || item.value == '' ) {
                    this.valid_flag = false;
                    item.classList.add('invalid');
                };
            }
            if (item.id == 'tel') {
                let reg = /^\([0-9]{3}\)[0-9]{3}\-[0-9]{2}\-[0-9]{2}/g;
                if (!reg.test(item.value) || item.value == '') {
                    this.valid_flag = false;
                    item.classList.add('invalid');
                }
            }
        })
    }
    visitor_table_show(even) {//функція виведення на єкран відвідувача
        this.code = `
            <tr>
                <td>${this.count}</td>
                <td>${even.fio}</td>
                <td>${even.tel}</td>
            </tr>`;
        document.querySelector('table').insertAdjacentHTML('beforeend', this.code);
        this.count++;
    }
    visitor_highlight(even) {//функція виділення рядка
        if (even.children[0].innerText != '№') {
            if (!even.classList.contains('active') && this.highlight == false) {
                even.classList.add('active');
                visitors.forEach((item) => {
                    if (item.fio === even.children[1].innerText)
                        this.del_edit = item.id;

                })
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
    visitor_delete() {//функція видалення книги
        if (this.del_edit != 0) {
            let i = 0;
            for (i = 0; i < visitors.length; i++){
                if (visitors[i].id == this.del_edit) {
                    break;
                }
            }
            visitors.splice((i - 1), 1)
            this.visitor_table_review();//виклик функції оновлення данних таблиці
            this.save_localStorage();//виклик функції збереження в localStorage
            this.highlight = false;
        }
    }
    visitor_table_review() {//функція оновлення данних таблиці 
        let table = this.wrap.querySelectorAll('table tbody');
            for (let i = 1; i < table.length; i++) {
                table[i].remove();
        }
        this.count = 1;
            visitors.forEach((item) => {
                this.visitor_table_show(item)//виклик функції виведення на єкран відвідувача
            });
    }
    visitor_edit() {//функція заповнення форми для редагування
        this.edit = true;
        if (this.del_edit != 0) {
            visitors.forEach((item)=>{
                if (item.id == this.del_edit) {
                    this.visitor_form_add_show();//виклик функції відкриття форми
                    this.input[0].value = item.fio;
                    this.input[1].value = item.tel;
                }
            })
        }
    }
    visitor_edit_save() {//функція збереження редагованих данних
        for (let i = 0; i < visitors.length;i++){
            if (visitors[i].id == this.del_edit) {
                visitors[i].fio = this.input[0].value;
                visitors[i].tel = this.input[1].value;
            }
        }
        this.input.forEach((even) => {
            even.value = '';
        })
        this.save_localStorage();//виклик функції збереження в localStorage
        this.visitor_table_review();//виклик функції оновлення данних таблиці 
        this.form.style.display = 'none';
        this.wrap.style.opacity = '1.0';
        this.edit = false;
        this.highlight = false;
    }
    visitor_search() {// функція пошуку
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
    visitor_sort() {//функція сортування
        let sort_text = this.wrap.querySelector('.sort_text').value;
        switch (sort_text) {
            case 'Full name a-z': {
                visitors.sort((a, b) => {
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
                visitors.sort((a, b) => {
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
            default: {
                break;
            }
        }
        let table = this.wrap.querySelectorAll('table tbody');
            for (let i = 1; i < table.length; i++) {
                table[i].remove();
        }
        this.count = 1;
            visitors.forEach((item) => {
                this.visitor_table_show(item);//виклик функції виведення на єкран відвідувача
            });
    }

    save_localStorage() {//функція збереження в localStorage
        visitors.sort(( a, b ) =>  a.id - b.id);
        localStorage.setItem('Visitors', JSON.stringify(visitors));
    }
    load_localStorage() {//функція завантаження данних з localStorage
        if (localStorage.getItem('Visitors') != null) {
            visitors = JSON.parse(localStorage.getItem('Visitors'));
            visitors.forEach((item) => {
                this.id = item.id;
                this.visitor_table_show(item);//виклик функції виведення на єкран відвідувача
            });
            this.id++;
        }
    }

init() {
        this.wrap.addEventListener('click', this.visitor_click_wrap.bind(this));//підкючення відстеження кліку по сторінці
        this.form.addEventListener('click', this.visitor_click_form.bind(this));//підкючення відстеження кліку по формі
        this.wrap.querySelector('.search_text').addEventListener('input', this.visitor_search.bind(this));//підключення введення данних в рядок пошуку
        this.load_localStorage();//виклик функції завантаження данних з localStorage
        }
}
let visitorPage = new VisitorPage();
visitorPage.init();
