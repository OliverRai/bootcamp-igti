import express from 'express';
import mongoose from 'mongoose';
import Router from './router/AccountRouter.js'

const app = express();
app.use(express.json());

app.use('/accounts', Router);

(async () => {
    try {
        await mongoose.connect('urimongo', { useNewUrlParser: true, useUnifiedTopology: true });
    } catch (err) {
        console.log(err)
    }
})();

const porta = 3001;

app.listen(porta, () => {
    console.log('Servidor iniciado na porta ' + porta);
})