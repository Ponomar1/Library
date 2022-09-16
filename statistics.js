'use strict';

let books = [];
let visitors = [];
let wrap = document.querySelector('.wrapper');
let stat_book = wrap.querySelector('.stat_book');
let stat_visitor = wrap.querySelector('.stat_visitor');

function load_books_localStorage() {//функція загрузки данних книг з localStorage
        if (localStorage.getItem('Books') != null) {
            books = JSON.parse(localStorage.getItem('Books'));
        }     
}
load_books_localStorage();//виклик функції загрузки данних книг з localStorage
function load_visitors_localStorage() {//функція загрузки данних відвідувачів з localStorage
        if (localStorage.getItem('Visitors') != null) {
            visitors = JSON.parse(localStorage.getItem('Visitors'));
        }
}
load_visitors_localStorage();//виклик функції загрузки данних відвідувачів з localStorage
function sort(even) {// функція сортування
    even.sort(( a, b ) =>  b.count - a.count);
}
sort(books);//фиклик функції сортування для книг
sort(visitors);//фиклик функції сортування для відвідувачів

function show(even, selector, name) {//функція виведення результатів топ 5
    
    let count = 5;
    let code = `<table>
                        <tr>
                            <th>№</th>
                            <th>Name</th>
                        </tr>`;
    for (let i = 0; i < even.length; i++){
        
        if (i < count) {
            code += `<tr>
                   <td>${i + 1}</td>`
            if (name == 'name') {
                code += `<td>${even[i].name}</td>
                          </tr>`;
            }
            else {
                code += `<td>${even[i].fio}</td>
                          </tr>`;
            }
        }
    }
    code += `</table>`;
    selector.insertAdjacentHTML('beforeend', code);    
}
show(books, stat_book, 'name');//виклик функції виведення результатів топ 5 книг
show(visitors, stat_visitor,'fio');//виклик функції виведення результатів топ 5 відвідувачів
