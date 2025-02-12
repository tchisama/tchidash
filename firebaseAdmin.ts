import admin from "firebase-admin";

interface FirebaseAdminAppParams {
  projectId: string;
  clientEmail: string;
  storageBucket: string;
  privateKey: string;
}

function formatPrivateKey(privateKey: string) {
  return privateKey.replace(/\\n/g, "\n");
}

export function createFirebaseAdminApp({
  projectId,
  clientEmail,
  storageBucket,
  privateKey,
}: FirebaseAdminAppParams) {
  if (admin.apps.length > 0) {
    return admin.app();
  }
  const cert = admin.credential.cert({
    projectId,
    clientEmail,
    privateKey: formatPrivateKey(privateKey),
  });

  const app = admin.initializeApp({
    credential: cert,
    projectId,
    storageBucket,
  });

  return app;
}

export async function initAdmin() {
  const app = createFirebaseAdminApp({
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID as string,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL as string,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET as string,
    privateKey: process.env.FIREBASE_PRIVATE_KEY as string,
  });
  return app;
}
