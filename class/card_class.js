'use strict';
export default class Card{
    constructor(id, fio_visitor, name_book, take_book, return_book) {
        this.id = id;
        this.fio_visitor = fio_visitor;
        this.name_book = name_book;
        this.take_book = take_book;
        this.return_book = return_book;
    }
}