const { performance } = require('perf_hooks');

const names = ['Adam', 'Emma', 'James', 'Jennifer', 'John', 'Kate', 'Mary', 'Patricia', 'Robert', 'William'];
const surnames = ['Anderson', 'Brown', 'Johnson', 'Jones', 'Miller', 'Smith', 'Taylor', 'Thomson', 'Williams', 'Wilson'];
const jobs = ['Unemployed', 'Accountant', 'Actor', 'Artist', 'Baker', 'Builder', 'Chef', 'Doctor', 'Driver', 'Guard',
    'Firefighter', 'IT Specialist', 'Mechanic', 'Nurse', 'Police officer', 'Politician', 'Post man', 'Scientist', 'Shop assistant', 'Teacher'];

const dataSchemaType = Object.freeze({
    'Arr': 'Array',
    'Obj': 'Object'
});

const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

const createEntries = (entriesNumber, schemaType) => {
    let data;

    if (schemaType === dataSchemaType.Arr) {
        data = [];
    } else if (schemaType === dataSchemaType.Obj) {
        data = {
            data: {},
            order: []
        };
    }

    for (let i = 0; i <= entriesNumber; i++) {
        const person = {
            name: names[getRandomInt(0, names.length - 1)],
            surname: surnames[getRandomInt(0, surnames.length - 1)],
            job: jobs[getRandomInt(0, jobs.length - 1)],
            age: getRandomInt(16, 99),
            address: {
                city: 'New York',
                street: '5th Avenue'
            },
            hobbies: ['Fishing', 'Cooking', 'Movies', 'Sport']
        };

        if (schemaType === dataSchemaType.Arr) {
            data.push({ ...person, _id: i + 1 });
        } else if (schemaType === dataSchemaType.Obj) {
            data.data[i + 1] = person;
            data.order.push[i + 1]
        }
    }

    return data;
};

const dbWithArrayCollection = { subscribers: createEntries(1000000, dataSchemaType.Arr) };
const dbWithObjectCollection = { listeners: createEntries(1000000, dataSchemaType.Obj) };

const dataSize = Buffer.byteLength(JSON.stringify(dbWithArrayCollection));

console.log('Data size in MB', (dataSize / (1024 * 1024)));
// console.log('Example', dbWithArrayCollection.subscribers[9876]);

const id = 987654;
const job = 'Scientist'
const age = 48;

const arrayMethods = {
    getAll: () => dbWithArrayCollection.subscribers,
    findById: () => dbWithArrayCollection.subscribers.find((entry) => entry._id === id),
    findByAgeOrJob: () => dbWithArrayCollection.subscribers.filter((entry) => entry.age === age || entry.job === job),
    sortByAge: () => dbWithArrayCollection.subscribers.sort((a, b) => a.age - b.age),
    sortBySurname: () => dbWithArrayCollection.subscribers.sort((a, b) => a.surname.localeCompare(b.surname)),
};

const objectMethods = {
    findById: () => dbWithObjectCollection.listeners.data[id],
    sortByAge: () => {
        dbWithObjectCollection.listeners.order
            .map((id) => ({ ...dbWithObjectCollection.listeners[id], _id: id }))
            .sort((a, b) => a.age - b.age)
    }
};

console.log('--- Array results:');

// for (const method of Object.keys(arrayMethods)) {
    // performance.mark(`start-array`);

    // arrayMethods.sortByAge();

    // performance.mark(`finish-array`);
    // performance.measure(`array`, `start-array`, `finish-array`);
    // console.log(`Array method finished in: ${performance.nodeTiming.duration.toFixed(2)}ms`);
// }

console.log('--- Object results:');

// for (const method of Object.keys(objectMethods)) {
    performance.mark(`start-object`);

    objectMethods.sortByAge();

    performance.mark(`finish-object`);
    performance.measure(`object`, `start-object`, `finish-object`);
    console.log(`Object method finished in: ${performance.nodeTiming.duration.toFixed(2)}ms`);
// }



