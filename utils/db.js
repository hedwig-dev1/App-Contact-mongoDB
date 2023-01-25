const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/kampus', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});

// membuat schema


// menambah satu data 
// const contact1 = new Contact({
//     nama: 'loki',
//     nohp: '0827601322233',
//     email: 'loki@gmail.com'
// })

// // simpan ke collection
// contact1.save().then((contact) => console.log(contact))