const FirebaseAdmin = require('firebase-admin');

const serviceAccount = require('./forgettable_service_account.json');

FirebaseAdmin.initializeApp({
  credential: FirebaseAdmin.credential.cert(serviceAccount),
});

export default FirebaseAdmin;
