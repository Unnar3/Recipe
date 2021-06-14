import { connect, Connection, connection, disconnect } from 'mongoose';
let database: Connection;

export const connectDatabase = () => {
    // add your own uri below
    const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}?retryWrites=true&w=majority`;
    if (database) {
        return;
    }
    connect(uri, {
        useNewUrlParser: true,
        useFindAndModify: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    });
    require('./user/user');
    require('./recipe/recipe');

    database = connection;
    database.once('open', async () => {
        console.log('Connected to database');
    });
    database.on('error', () => {
        console.log('Error connecting to database');
        throw new Error('Error connecting to database');
    });
};

export const disconnectDatabase = () => {
    if (!database) {
        return;
    }
    disconnect();
};
