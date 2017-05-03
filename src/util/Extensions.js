/* eslint-disable func-name-matching */

const { Message } = require('discord.js');

// Makes messages look nicer.
Object.defineProperty(Message.prototype, 'send', {
    value: function send(content, options) {
        if (Array.isArray(content)) content = content.join('\n');
        if (typeof content === 'string') content = `**${this.author.tag} ::** ${content}`;
        return this.channel.send(content, options);
    }
});

Object.defineProperty(String.prototype, 'capitalize', {
    value: function capitalize() {
        return this[0].toUpperCase() + this.slice(1);
    }
});

Object.defineProperty(String.prototype, 'pad', {
    value: function pad(width, char = '0') {
        return this.length >= width ? this : new Array(width - this.length + 1).join(char) + this;
    }
});

Object.defineProperty(Number.prototype, 'plural', {
    value: function plural(singularText, pluralText, withNumber = false) {
        if (Math.abs(this) === 1) return (withNumber ? this : '') + singularText;
        return (withNumber ? this : '') + pluralText;
    }
});

Object.defineProperty(Math, 'bound', {
    value: function bound(num, min, max) {
        return Math.min(Math.max(num, min), max);
    }
});

Object.defineProperty(Array.prototype, 'group', {
    value: function group(fn, thisArg) {
        if (thisArg) fn = fn.bind(thisArg);

        return this.reduce((obj, item) => {
            const prop = fn(item);

            if (!obj[prop]) obj[prop] = [];
            obj[prop].push(item);

            return obj;
        }, {});
    }
});
