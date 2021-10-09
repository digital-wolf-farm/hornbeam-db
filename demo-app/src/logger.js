import chalk from 'chalk';

export default function loggerService(module) {

    function debug(message, details) {
        let log;

        if (details) {
            log = `${getUserFriendlyTime()} [deb] [${module}] - ${message}. Details: ${JSON.stringify(details)}`;
        } else {
            log = `${getUserFriendlyTime()} [deb] [${module}] - ${message}.`;
        }

        console.log(chalk.blue(log));
    }

    function info(message) {
        const log = `${getUserFriendlyTime()} [inf] [${module}] - ${message}`;

        console.log(chalk.white(log));
    }

    function warn(message) {
        const log = `${getUserFriendlyTime()} [wrn] [${module}] - ${message}`;

        console.log(chalk.yellow(log));
    }

    function error(message, error) {
        let log;

        if (error) {
            log = `${getUserFriendlyTime()} [err] [${module}] - ${message}. Error - ${JSON.stringify(error)}`;
        } else {
            log = `${getUserFriendlyTime()} [err] [${module}] - ${message}.`;
        }

        console.log(chalk.red(log));
    }

    function getUserFriendlyTime() {
        const date = new Date();

        const hour = `0${date.getHours()}`.slice(-2);
        const minutes = `0${date.getMinutes()}`.slice(-2);
        const seconds = `0${date.getSeconds()}`.slice(-2);
        const miliseconds = `00${date.getMilliseconds()}`.slice(-3);

        return `${hour}:${minutes}:${seconds}.${miliseconds}`;
    }

    return { debug, info, warn, error };
}