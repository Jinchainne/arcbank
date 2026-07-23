import type { VercelRequest, VercelResponse } from '@vercel/node';

const VERCEL_TOKEN = process.env.VERCEL_DEPLOY_TOKEN || '';
const PROJECT_ID = 'prj_ytIdCIKJTjjlcGYiKzw3ir8QFULD';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Verify admin session
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { products } = req.body;
  if (!products || !Array.isArray(products)) {
    return res.status(400).json({ error: 'Invalid products data' });
  }

  try {
    // Step 1: Get latest deployment
    const deployRes = await fetch(
      `https://api.vercel.com/v6/deployments?projectId=${PROJECT_ID}&limit=1`,
      { headers: { Authorization: `Bearer ${VERCEL_TOKEN}` } }
    );
    const deployData = await deployRes.json();
    const deployId = deployData.deployments?.[0]?.uid;

    if (!deployId) {
      return res.status(500).json({ error: 'No deployment found' });
    }

    // Step 2: Get files tree from deployment
    const filesRes = await fetch(
      `https://api.vercel.com/v7/deployments/${deployId}/files`,
      { headers: { Authorization: `Bearer ${VERCEL_TOKEN}` } }
    );
    const filesTree = await filesRes.json();

    // Step 3: Collect all file UIDs (flatten tree)
    const fileRefs: { file: string; uid: string; size: number }[] = [];
    function collectFiles(nodes: any[], path: string = '') {
      for (const node of nodes) {
        const fullPath = path ? `${path}/${node.name}` : node.name;
        if (node.type === 'file' && node.uid) {
          // Skip the old products.json - we'll replace it
          if (fullPath === 'public/data/products.json') continue;
          fileRefs.push({ file: fullPath, uid: node.uid, size: node.mode || 0 });
        }
        if (node.children) {
          collectFiles(node.children, fullPath);
        }
      }
    }
    collectFiles(filesTree);

    // Step 4: Add updated products.json
    const productsJson = JSON.stringify({
      version: '1.0',
      updatedAt: new Date().toISOString(),
      products
    }, null, 2);

    fileRefs.push({
      file: 'public/data/products.json',
      uid: '',
      size: 0,
    });

    // Step 5: Create new deployment with updated file
    // Use the "clone" approach - reference old files by UID, provide new content for changed file
    const files = fileRefs.map(f => {
      if (f.file === 'public/data/products.json') {
        return {
          file: f.file,
          data: Buffer.from(productsJson).toString('base64'),
          encoding: 'base64',
        };
      }
      return { file: f.file, sha: f.uid, size: f.size };
    });

    const createRes = await fetch('https://api.vercel.com/v13/deployments', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${VERCEL_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'arcbank',
        deploymentId: deployId,
        files,
        projectSettings: {
          buildCommand: 'npm run build',
          outputDirectory: 'dist',
          framework: 'vite',
        },
      }),
    });

    const result = await createRes.json();

    if (result.uid) {
      return res.status(200).json({
        success: true,
        message: 'Deployment started',
        deployId: result.uid,
        url: `https://${result.url || 'arcbank.vercel.app'}`,
      });
    }

    return res.status(500).json({ error: 'Failed to create deployment', details: result });
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message });
  }
}
