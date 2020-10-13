import express from 'express';
import {promises as fs} from 'fs';

import studentsRoute from './routes/grades.js';

const {readFile, writeFile} = fs;

const app = express();
app.use(express.json());

app.use('/students', studentsRoute);

app.listen(3001, async() => {
    try {
        await readFile("grades.json");
        console.log('Api started');
    } catch (err) {
        const initialJson = {
            nextId: 1,
            students: []
        }
        await writeFile("grades.json", JSON.stringify(initialJson)).then(() => {
            console.log('Api started and file created');
        }).catch(err => {
            console.log(err);
        })
    }
})