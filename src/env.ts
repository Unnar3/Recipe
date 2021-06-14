require('dotenv').config();

export const validate = () => {
    if (!process.env.DB_HOST) {
        throw Error('required environment variable missing: DB_HOST');
    }
    if (!process.env.DB_USER) {
        throw Error('required environment variable missing: DB_USER');
    }
    if (!process.env.DB_PASSWORD) {
        throw Error('required environment variable missing: DB_PASSWORD');
    }
};
