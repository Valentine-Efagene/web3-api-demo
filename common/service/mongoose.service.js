import mongoose from 'mongoose';
import debug from 'debug';

const log = debug('app:mongoose-service');

class MongooseService {
    count = 0;
    mongooseOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000,
        // useFindAndModify: false,
    };

    constructor() {
        this.connectWithRetry()
    }

    getMongoose() {
        return mongoose
    }

    connectWithRetry = () => {
        log('Attempting MongoDB connection (will retry if needed)')
        mongoose
            // .connect('mongodb://localhost:27017/api-db', this.mongooseOptions) // For docker
            .connect('mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass%20Community&ssl=false', this.mongooseOptions)
            .then(() => {
                log('MongoDB is connected')
            })
            .catch((err) => {
                const retrySeconds = 5
                log(
                    `MongoDB connection unsuccessful (will retry #${++this
                        .count} after ${retrySeconds} seconds):`,
                    err
                );
                setTimeout(this.connectWithRetry, retrySeconds * 1000)
            });
    };
}
export default new MongooseService()