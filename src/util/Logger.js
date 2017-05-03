const chalk = require('chalk');
const moment = require('moment');
const util = require('util');

class Logger {
    static log(...args) {
        const text = this.prepareText(args);
        this.writeToConsole(text, {
            color: 'grey',
            tag: 'Log'
        });
    }

    static info(...args) {
        const text = this.prepareText(args);
        this.writeToConsole(text, {
            color: 'green',
            tag: 'Info'
        });
    }

    static warn(...args) {
        const text = this.prepareText(args);
        this.writeToConsole(text, {
            color: 'yellow',
            tag: 'Warn'
        });
    }

    static error(...args) {
        const text = this.prepareText(args);
        this.writeToConsole(text, {
            color: 'red',
            tag: 'Error',
            error: true
        });
    }

    static stackTrace(...args) {
        const text = this.prepareText(args);
        this.writeToConsole(text, {
            color: 'white',
            tag: 'Error',
            error: true
        });
    }

    static writeToConsole(content, options = {}) {
        const { color = 'grey', tag = 'Log', error = false } = options;
        const timestamp = chalk.cyan(`[${moment().format('YYYY-MM-DD HH:mm:ss')}]:`);
        const levelTag = chalk.bold(`[${tag}]:`);
        const text = chalk[color](content);
        const std = error ? process.stderr : process.stdout;
        std.write(`${timestamp} ${levelTag} ${text}\n`);
    }

    static clean(item) {
        if (typeof item === 'string') return item;
        const cleaned = util.inspect(item, { depth: Infinity });
        return cleaned;
    }

    static prepareText(args) {
        const cleanedArgs = [];
        for (const arg of args) {
            cleanedArgs.push(this.clean(arg));
        }

        return cleanedArgs.join(' ');
    }
}

module.exports = Logger;
