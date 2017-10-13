const S = require('spray-wrtc');
const U = require('unicast-definition');

// #1 create 3 peers
const s1 = new S({config:{trickle:true}});
const s2 = new S({config:{trickle:true}});
const s3 = new S({config:{trickle:true}});
// #2 associate a unicast protocol to each peer
const u1 = new U(s1, {retry:1, pid:'1'});
const u2 = new U(s2, {retry:1, pid:'1'});
const u3 = new U(s3, {retry:1, pid:'1'});

u1.on('meow',(i, am, a, cat) => console.log('@s1: %s %s %s %s', i, am, a, cat));
u2.on('meow',(i, am, a, cat) => console.log('@s2: %s %s %s %s', i, am, a, cat));
u3.on('meow',(i, am, a, cat) => console.log('@s3: %s %s %s %s', i, am, a, cat));


const u4 = new U(s1, {retry:1, pid:'2'});
const u5 = new U(s2, {retry:1, pid:'2'});
const u6 = new U(s3, {retry:1, pid:'2'});


u4.on(':3',(i, is, cat) => console.log('@s1: miaw'));
u5.on(':3',(i, is, cat) => console.log('@s2: meow'));
u6.on(':3',(i, is, cat) => console.log('@s3: miou'));

// #4 simulate signaling server
const callback = (from, to) => {
    return (offer) => {
        to.connect( (answer) => { from.connect(answer); }, offer);
    };
};

// #4 s1 contacts s2, 2-peers network
s1.join(callback(s1, s2)).then(console.log('s1 <=> s2.'));
// #5 s3 contacts s2, 3-peers network
setTimeout( () => s3.join(callback(s3, s2))
            .then(console.log('s1 <=> s2; s1 -> s3; s3 -> s2')),
            4000);
// #6 s2 should log 2 different messages.
setTimeout( () => u3.emit('meow',
                            s3.getPeers(1)[0], 'i', 'am', 'a', 'cat')
            .then(u3.emit(':3',
                            s3.getPeers(1)[0], 'parameters', 'dont', 'matter'))
            .then(u6.emit(':3',
                            s3.getPeers(1)[0], 'parameters', 'dont', 'matter')),
            6000);
