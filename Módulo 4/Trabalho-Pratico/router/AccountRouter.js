import express from 'express';
import { AccountModel } from '../models/AccountModel.js';

const router = express.Router();

router.put('/deposito', async (req, res) => {
    try {
        const { agencia, conta, valor } = req.body;

        const result = await AccountModel.findOneAndUpdate(
          { agencia: agencia, conta: conta },
          { $inc: { balance: valor } },
          { new: true }
        );
  
        if (result) {
          res.status(200).send(result);
        } else {
          res.status(500).send({ Error: 'Invalid account.' });
        }
    } catch (err) {
        console.log('Falha ao realizar operação. Erro: ' + err);
    }
});

router.put('/saque', async (req, res) => {
    try {
        const { agencia, conta, valor } = req.body;

        const tarifa = 1;

        const novoValor = valor + tarifa;

        const result = await AccountModel.findOne({ agencia: agencia, conta: conta });

        if (result) {
            const saldo = result.balance - novoValor;

            if (saldo < 0) {
                res.status(500).send({ Error: 'No funds avaliable.' });
            } else {
                const newResult = await AccountModel.findOneAndUpdate(
                    { agencia: agencia, conta: conta },
                    { $inc: { balance: -novoValor } },
                    { new: true }
                );

                res.status(200).send(newResult);
            }
        } else {
            res.status(500).send({ Error: 'Invalid account.' });
        }
    } catch (err) {
        console.log('Falha ao realizar operação. Erro: ' + err);
    }
});

router.get('/saldo', async (req, res) => {
    try {
        const { agencia, conta } = req.body;

        const result = await AccountModel.findOne({ agencia: agencia, conta: conta });
  
        if (result) {
          res.status(200).send(result);
        } else {
          res.status(500).send({ Error: 'Account not found.' });
        }
    } catch (err) {
        console.log('Falha ao realizar operação. Erro: ' + err);
    }
});

router.delete('/deletar', async (req, res) => {
    try {

        const { agencia, conta } = req.body;

        const result = await AccountModel.findOneAndDelete({ agencia, conta });
        const contas = await AccountModel.find({ agencia });
        const resultContas = contas.length;
  
        if (result) {
          res.status(200).send({ result, resultContas });
        } else {
          res.status(500).send({ Error: 'Account not found.' });
        }
    } catch (err) {
        console.log('Falha ao realizar operação. Erro: ' + err);
    }
});

router.put('/transferencia', async (req, res) => {
    try {
        const { conta_origem, conta_destino, valor } = req.body;

        const tarifa = 8;

        const novoValor = valor + tarifa;

        const resultOrigem = await AccountModel.findOne({ conta: conta_origem });
        const resultDestino = await AccountModel.findOne({ conta: conta_destino });

        if (resultOrigem && resultDestino) {
            if (resultOrigem.agencia === resultDestino.agencia) {
                const saldo = resultOrigem.balance - valor;
                if (saldo < 0) {
                    res.status(500).send({ Error: 'No funds available.' });
                } else {
                    resultOrigem.balance -= valor;
                    resultOrigem.save();
                    resultDestino.balance += valor;
                    resultDestino.save();
                    res.status(200).send({ resultOrigem, resultDestino });
                }
            } else {
                const saldo = resultOrigem.balance - novoValor;
                if (saldo < 0) {
                    res.status(500).send({ Error: 'No funds available.' });
                } else {
                    resultOrigem.balance -= novoValor;
                    resultOrigem.save();
                    resultDestino.balance += valor;
                    resultDestino.save();
                    res.status(200).send({ resultOrigem, resultDestino });
                }
            }
        } else {
            res.status(500).send({ Error: 'Account not found.' });
        }
    } catch (err) {
        console.log('Falha ao realizar operação. Erro: ' + err);
    }
});

router.get('/calcularMedia', async (req, res) => {
    try {
        const { agencia } = req.body;

        const result = await AccountModel.find({ agencia }, { _id: 0, balance: 1 });

        if (!result) {
            res.status(500).send({ Error: 'Agency not found.' });
        } else {
            let somaBalance = 0;

            result.forEach((balance) => {
                somaBalance += balance.balance;
            });

            const mediaBalance = {
                agencia,
                media: (somaBalance / result.length).toFixed(2),
            };

            const json = JSON.stringify(mediaBalance);

            res.status(200).send(json);
        }
    } catch (err) {
        console.log('Falha ao realizar operação. Erro: ' + err);
    }
});

router.get('/menorSaldo', async (req, res) => {
    try {
        const { quantidade } = req.body;

        const result = await AccountModel.find(
            {},
            { _id: 0, agencia: 1, conta: 1, name: 1, balance: 1 }
        )
            .sort({ balance: 1 })
            .limit(quantidade);

        res.status(200).send(result);
    } catch (err) {
        console.log('Falha ao realizar operação. Erro: ' + err);
    }
},
)

router.get('/maiorSaldo', async (req, res) => {
    try {
        const { quantidade } = req.body;

        const result = await AccountModel.find(
            {},
            { _id: 0, agencia: 1, conta: 1, name: 1, balance: 1 }
        )
            .sort({ balance: -1, name: 1 })
            .limit(quantidade);

        res.status(200).send(result);
    } catch (err) {
        console.log('Falha ao realizar operação. Erro: ' + err);
    }
});

router.get('/private', async (req, res) => {
    try {
        const findAgencies = await AccountModel.distinct('agencia');

        console.log(findAgencies);

        for (const agency of findAgencies) {
            const findTopAccount = await AccountModel.find({ agencia: agency })
                .sort({ balance: -1 })
                .limit(1);

            const { name, balance, conta } = findTopAccount[0];

            await AccountModel.create({
                agencia: 99,
                name,
                balance,
                conta,
            });
        }

        const findPrivateAgency = await AccountModel.find({ agencia: 99 });

        return res.status(200).send(findPrivateAgency);
    } catch (err) {
        console.log('Falha ao realizar operação. Erro: ' + err);
    }
})

export default router;