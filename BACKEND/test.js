const bcrypt = require('bcrypt');

const motDePasse = 'admin1234';
const saltRounds = 10; // Facteur de coût

bcrypt.hash(motDePasse, saltRounds, function(err, hash) {
    console.log(hash);
    // Résultat exemple: $2b$10$N9qo8uLOickgx2ZMRZoMye...
});

// Ou avec async/await
async function hasherMotDePasse() {
    const hash = await bcrypt.hash('admin1234', 10);
    console.log(hash);
}