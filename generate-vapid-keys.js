import crypto from "crypto";

function generateVAPIDKeys() {
  const curve = crypto.createECDH("prime256v1");
  curve.generateKeys();

  const publicKey = curve.getPublicKey("base64url");
  const privateKey = curve.getPrivateKey("base64url");

  console.log("VAPID Keys geradas:");
  console.log("Public Key:", publicKey);
  console.log("Private Key:", privateKey);
}

generateVAPIDKeys();
