const { writeFileSync, readFileSync, statSync, unlinkSync } = require('fs');
const { performance } = require('perf_hooks');

const startWriting = 'startWriting';
const endWriting = 'endWriting';
const writingTask = 'writingTask';
const startReading = 'startReading';
const endReading = 'endReading';
const readingTask = 'readingTask';

const filePath = './test.json';

// About 10kB
const exampleObject = {
    key1: 'test1'.repeat(1024),
    key2: 'test2'.repeat(1024)
}

const fileSizeInMB = 20;
const data = new Array(fileSizeInMB * 102.4).fill({ ...exampleObject });

console.log('Data size in MB: ', Buffer.byteLength(JSON.stringify(data)) / (1024 * 1024));

function writeFile() {
    writeFileSync(filePath, JSON.stringify(data, null, 4), { encoding: 'utf-8' });
}

function readFile() {
    readFileSync(filePath, { encoding: 'utf-8' });
}

performance.mark(startWriting);

writeFile();

performance.mark(endWriting);
performance.measure(writingTask, startWriting, endWriting);
console.log('Writing file time in ms: ', performance.nodeTiming.duration);

performance.mark(startReading);

readFile();

performance.mark(endReading);
performance.measure(readingTask, startReading, endReading);
console.log('Reading file time in ms: ', performance.nodeTiming.duration);


