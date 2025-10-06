import { NextApiRequest, NextApiResponse } from 'next';
import { Nango } from '@nangohq/node';

const nango = new Nango({ 
  secretKey: process.env.NANGO_SECRET_KEY!,
  host: process.env.NANGO_HOST || 'https://api.nango.dev'
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { action, integrationId } = req.query;

    if (action === 'integrations') {
      // List all integrations
      const response = await nango.listIntegrations();
      res.status(200).json({ 
        integrations: response.configs,
        total: response.configs.length
      });
    } else if (action === 'connections' && integrationId) {
      // List connections for a specific integration
      const response = await nango.listConnections(integrationId as string);
      res.status(200).json({ 
        connections: response.connections,
        total: response.connections.length
      });
    } else {
      res.status(400).json({ error: 'Invalid action or missing integrationId' });
    }
  } catch (error: any) {
    console.error('Nango API error:', error);
    
    // Handle rate limiting as per Nango docs
    if (error.response?.status === 429) {
      const retryAfter = error.response.headers['retry-after'];
      res.status(429).json({ 
        error: 'Rate limited',
        retryAfter: retryAfter ? parseInt(retryAfter) : 60
      });
      return;
    }
    
    res.status(500).json({ 
      error: 'Failed to fetch data',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
