const FirebaseAdmin = require("firebase-admin");

var serviceAccount = require("./forgettable_service_account.json");

FirebaseAdmin.initializeApp({
  credential: FirebaseAdmin.credential.cert(serviceAccount)
});

export default FirebaseAdmin
