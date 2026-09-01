import fs from 'node:fs';
import path from 'node:path';
import { GoogleAuth } from 'google-auth-library';

const projectId = 'rutba-b36f6';
const keyFile = path.resolve('firebase-service-account.json');
const auth = new GoogleAuth({
  keyFile,
  scopes: ['https://www.googleapis.com/auth/firebase']
});
const client = await auth.getClient();
const api = 'https://firebaserules.googleapis.com/v1';

async function publish(fileName, releaseSuffix) {
  const content = fs.readFileSync(path.resolve(fileName), 'utf8');
  const rulesetResponse = await client.request({
    url: `${api}/projects/${projectId}/rulesets`,
    method: 'POST',
    data: { source: { files: [{ name: fileName, content }] } }
  });
  const rulesetName = rulesetResponse.data.name;
  const releaseName = `projects/${projectId}/releases/${releaseSuffix}`;

  try {
    await client.request({
      url: `${api}/${releaseName}`,
      method: 'PATCH',
      data: {
        release: { name: releaseName, rulesetName },
        updateMask: 'rulesetName'
      }
    });
  } catch (error) {
    if (error?.response?.status !== 404) throw error;
    await client.request({
      url: `${api}/projects/${projectId}/releases`,
      method: 'POST',
      data: { name: releaseName, rulesetName }
    });
  }

  console.log(`published=${releaseSuffix}`);
}

await publish('firestore.rules', 'cloud.firestore');
await publish('storage.rules', 'firebase.storage/rutba-b36f6.firebasestorage.app');
