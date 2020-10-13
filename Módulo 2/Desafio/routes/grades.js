import express from 'express';
import { promises as fs } from 'fs';

const { readFile, writeFile } = fs;

const router = express.Router();

router.post('/', async (req, res, next) => {
    try {
        let student = req.body;
        const data = JSON.parse(await readFile("grades.json"));

        const datahora = new Date();

        student = { id: data.nextId++, ...student, timestamp: datahora };

        data.grades.push(student);

        await writeFile("grades.json", JSON.stringify(data, null, 2));

        res.send(student)
    } catch (err) {
        next(err);
    }
});

router.get('/', async (req, res, next) => {
    try {
        const data = JSON.parse(await readFile("grades.json"));
        delete data.nextId;
        res.send(data)
    } catch (err) {
        next(err);
    }
});

//consultar nota final
//student => student.student === req.body.student && student.subject === req.body.subject
router.get('/somar', async(req, res, next) => {
    try {
        const {student, subject} = req.body;
        const data = JSON.parse(await readFile("grades.json"));
        const alunos = data.grades.filter(s => s.student === student && s.subject === subject);
        const notaTotal = alunos.reduce((acc,cur) => {
            return acc + parseInt(cur.value);
        }, 0)
        
        const result = {
            student,
            subject,
            notaTotal
        };
        res.send(result);
    } catch (err) {
        next(err);
    }
});


//consultar media
router.get('/media', async(req, res, next) => {
    try {
        const {subject, type} = req.body
        const data = JSON.parse(await readFile("grades.json"));
        const student = data.grades = data.grades.filter(s=> s.subject === subject && s.type === type);
        const notaTotal = student.reduce((acc, cur) => {
            return acc + parseInt(cur.value);
        }, 0);

        const media = notaTotal / student.length;
        const result = {
            subject,
            type,
            media,
        };
        res.send(result);
    } catch (err) {
        next(err);
    }
});

router.get('/maioresNotas', async(req, res, next) => {
    try {
        const {subject, type} = req.body
        const data = JSON.parse(await readFile("grades.json"));
        const student = data.grades.filter(s=> s.subject === subject && s.type === type);
        student.sort((a,b) => {
            return b.value - a.value;
        });

        res.send(student)
    } catch (err) {
        next(err);
    }
})

router.get('/:id', async (req, res, next) => {
    try {
        const data = JSON.parse(await readFile("grades.json"));
        const student = data.grades.find(student => student.id === parseInt(req.params.id));
        res.send(student)
    } catch (err) {
        next(err);
    }
})

router.put('/', async (req, res, next) => {
    try {
        const student = req.body;
        const data = JSON.parse(await readFile("grades.json"));

        const index = data.grades.findIndex(std => std.id === student.id);
        data.grades[index] = student;

        await writeFile("grades.json", JSON.stringify(data, null, 2));
        res.send(student);

    } catch (err) {
        next(err);
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        const data = JSON.parse(await readFile("grades.json"));
        data.grades = data.grades.filter(student => student.id !== parseInt(req.params.id));

        await writeFile("grades.json", JSON.stringify(data, null, 2));
        res.end();
    } catch (err) {
        next(err);
    }
});

router.use((err, req, res, next) => {
    console.log(err);
    res.status(400).send({err: err.message})
});


export default router;