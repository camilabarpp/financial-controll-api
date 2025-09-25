const mongoose = require('mongoose');

console.log('MONGO_URI:', process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Conectado com sucesso!');
    process.exit(0);
  })
  .catch(err => {
    console.error('Erro ao conectar:', err);
    process.exit(1);
  });
