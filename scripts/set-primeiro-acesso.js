// Marca (ou desmarca) a flag primeiroAcesso de uma conta admin via Admin SDK,
// contornando a regra de seguranca que so permite o proprio dono desligar a
// flag (nunca liga-la) - so o super-admin pode iniciar o fluxo.
//
// Uso:
//   node scripts/set-primeiro-acesso.js admin.is-tecnologia-77@77istecnologia.com.br true

const { initializeApp, cert } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const { getDatabase } = require('firebase-admin/database');
const path = require('path');

const serviceAccount = require(path.join(__dirname, 'serviceAccountKey.json'));

const app = initializeApp({
  credential: cert(serviceAccount),
  databaseURL: 'https://cardapio-digital-73474-default-rtdb.firebaseio.com',
});

const auth = getAuth(app);
const db = getDatabase(app);

const email = process.argv[2];
const valor = process.argv[3] === 'false' ? false : true;

if (!email) {
  console.error('Uso: node scripts/set-primeiro-acesso.js <email> [true|false]');
  process.exit(1);
}

(async () => {
  try {
    const user = await auth.getUserByEmail(email);
    await db.ref(`admins/${user.uid}/primeiroAcesso`).set(valor);
    console.log(`primeiroAcesso = ${valor} para ${email} (uid: ${user.uid})`);
  } catch (e) {
    console.error('Erro:', e.message);
    process.exit(1);
  }
})();
