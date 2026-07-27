// Script local para redefinir a senha de uma conta Firebase Auth pelo terminal.
// A senha e' digitada por voce, direto no prompt do proprio terminal - nao passa
// por chat, nao fica salva em arquivo nem em historico de comandos.
//
// Uso:
//   node scripts/reset-senha-admin.js admin.is-tecnologia-77@77istecnologia.com.br
//
// Pre-requisito: colocar o arquivo da service account em
//   scripts/serviceAccountKey.json
// (baixado em: Firebase Console > Configuracoes do projeto > Contas de servico
// > Gerar nova chave privada). Esse arquivo NAO deve ser commitado no git.

const { initializeApp, cert } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const readline = require('readline');
const path = require('path');

const serviceAccount = require(path.join(__dirname, 'serviceAccountKey.json'));

const app = initializeApp({ credential: cert(serviceAccount) });
const auth = getAuth(app);

const email = process.argv[2];
if (!email) {
  console.error('Uso: node scripts/reset-senha-admin.js <email>');
  process.exit(1);
}

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

rl.question(`Nova senha para ${email}: `, async (senha) => {
  try {
    if (senha.length < 6) throw new Error('A senha precisa ter pelo menos 6 caracteres.');
    const user = await auth.getUserByEmail(email);
    await auth.updateUser(user.uid, { password: senha });
    console.log(`Senha atualizada com sucesso para ${email}.`);
  } catch (e) {
    console.error('Erro:', e.message);
  } finally {
    rl.close();
  }
});
