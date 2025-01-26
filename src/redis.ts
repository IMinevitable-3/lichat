import Redis from 'ioredis';

const subscriber = new Redis({ host: 'rds', port: 6379 });
const publisher = new Redis({ host: 'rds', port: 6379 });

export const Subscriber = {
    subscribe: (channel: string, callback: (channel: string, message: string) => void) => {
        subscriber.subscribe(channel, (err, count) => {
            if (err) {
                console.error(`Failed to subscribe to ${channel} channel:`, err);
            } else {
                console.log(`Subscribed to ${channel} channel. Count: ${count}`);
            }
        });

        subscriber.on('message', callback);
    }
};
export const Publisher = {
    publish: (channel: string, message: string) => {
        publisher.publish(channel, message);
    }
};