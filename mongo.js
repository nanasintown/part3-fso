const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('give password as argument');
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://nana:${password}@clusternana.dnbrgy4.mongodb.net/phonebookApp?retryWrites=true&w=majority`;

mongoose.set('strictQuery', false);
mongoose.connect(url);

const phoneSchema = new mongoose.Schema({
  name: String,
  number: String,
  id: Number,
});

const Phonebook = mongoose.model('Phonebook', phoneSchema);

if (process.argv.length < 5) {
  Phonebook.find({}).then((result) => {
    console.log('phonebook:');
    result.forEach(({ name, number }) => {
      console.log(`${name} ${number}`);
    });
    mongoose.connection.close();
  });
} else {
  const name = process.argv[3];
  const number = process.argv[4];
  const id = Math.floor(Math.random() * 1000001);

  const phonebook = new Phonebook({ name, number, id });

  phonebook.save().then((result) => {
    console.log(
      `added ${process.argv[3]} number ${process.argv[4]} to phonebook`
    );
    mongoose.connection.close();
  });
}
