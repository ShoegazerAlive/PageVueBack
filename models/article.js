'use strict'

let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let ArticleSchema = Schema({
    title: String,
    content: String,
    date: { type: Date, default: Date.now },
    image: String,
});

module.exports = mongoose.model('Article', ArticleSchema);