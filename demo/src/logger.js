import chalk from 'chalk';

export default function loggerService(module) {

    function info(message) {
        const log = `${getUserFriendlyTime()} [info] [${module}] - ${message}`;

        console.log(chalk.white(log));
    }

    function warn(message) {
        const log = `${getUserFriendlyTime()} [warn] [${module}] - ${message}`;

        console.log(chalk.yellow(log));
    }

    function error(message, error) {
        let log;

        if (error) {
            log = `${getUserFriendlyTime()} [error] [${module}] - ${message}. Error - ${JSON.stringify(error)}`;
        } else {
            log = `${getUserFriendlyTime()} [error] [${module}] - ${message}.`;
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

    return { info, warn, error };
}