import mongoose from 'mongoose';

const accountModel = mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    conta: {
        type: Number,
        require: true
    },
    agencia: {
        type: Number,
        require: true
    },
    balance: {
        type: Number,
        require: true,
        min: 1
    }
});

const AccountModel = mongoose.model('accounts', accountModel);

export {AccountModel};