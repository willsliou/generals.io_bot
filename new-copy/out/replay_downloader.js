import redis from 'redis';
const pub = redis.createClient({ host: 'localhost', port: 6379 });
const sub = redis.createClient({ host: 'localhost', port: 6379 });


// Attach error handlers
pub.on('error', err => {
  console.error('Error occurred with pub client:', err);
});
sub.on('error', err => {
  console.error('Error occurred with sub client:', err);
});

// Subscribe to a channel
sub.subscribe('my_channel', () => {
  console.log('Subscribed to my_channel');
});

sub.on('subscribe', (channel, count) => {
    console.log(`Subscribed to channel: ${channel}. Total subscriptions: ${count}`);
  });
  


// Wait for the pub client to be ready before publishing a message
pub.on('ready', () => {
  console.log('Pub client is ready');
  pub.publish('my_channel', 'Hello, world!', () => {
    console.log('Published message to my_channel');
  });
});
