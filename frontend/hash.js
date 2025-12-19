const bcrypt = require('bcrypt');
bcrypt.hash('manager1234', 10).then(hash => console.log(hash));