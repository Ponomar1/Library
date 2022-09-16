'use strict';

export default class Book{
    constructor(id, name, fio, year, publish, page, amount, count) {
        this.id = id;
        this.name = name;
        this.fio = fio;
        this.year = year;
        this.publish = publish;
        this.page = page;
        this.amount = amount;
        this.count = count;
    }
}

