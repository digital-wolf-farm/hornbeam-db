import { DB } from '../interfaces/db';

let database: DB;
let databaseFilePath: string;

function load(): void { }

function save(): void { }

function close(): void { }

function add(): void { }

function find(): void { }

function replace(): void { }

function remove(): void { }

export const db = { load, save, close };

export const entry = { add, find, replace, remove };