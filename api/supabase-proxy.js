export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { entity, action, id, data, query } = req.body || {};

  // Simple routing based on entity and action
  if (!entity) {
    return res.status(400).json({ error: 'Entity parameter missing' });
  }

  try {
    // Import Supabase client with service role key (set via Vercel env)
    const { createClient } = require('@supabase/supabase-js');

    const supa = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    let result;

    switch (entity) {
      case 'products':
        switch (action) {
          case 'select':
            result = await supa.from('products').select('*');
            break;
          case 'insert':
            result = await supa.from('products').insert([data]).select();
            break;
          case 'update':
            result = await supa.from('products').update(data).eq('id', id).select();
            break;
          case 'delete':
            result = await supa.from('products').delete().eq('id', id);
            break;
          default:
            return res.status(400).json({ error: 'Invalid action for products' });
        }
        break;

      case 'orders':
        switch (action) {
          case 'select':
            result = await supa.from('orders').select('*');
            break;
          case 'insert':
            result = await supa.from('orders').insert([data]).select();
            break;
          case 'update':
            result = await supa.from('orders').update(data).eq('id', id).select();
            break;
          case 'delete':
            result = await supa.from('orders').delete().eq('id', id);
            break;
          default:
            return res.status(400).json({ error: 'Invalid action for orders' });
        }
        break;

      case 'partners':
        switch (action) {
          case 'select':
            result = await supa.from('partners').select('*');
            break;
          case 'insert':
            result = await supa.from('partners').insert([data]).select();
            break;
          case 'update':
            result = await supa.from('partners').update(data).eq('id', id).select();
            break;
          case 'delete':
            result = await supa.from('partners').delete().eq('id', id);
            break;
          default:
            return res.status(400).json({ error: 'Invalid action for partners' });
        }
        break;

      case 'categories':
        switch (action) {
          case 'select':
            result = await supa.from('categories').select('*');
            break;
          case 'insert':
            result = await supa.from('categories').insert([data]).select();
            break;
          case 'update':
            result = await supa.from('categories').update(data).eq('id', id).select();
            break;
          case 'delete':
            result = await supa.from('categories').delete().eq('id', id);
            break;
          default:
            return res.status(400).json({ error: 'Invalid action for categories' });
        }
        break;

      case 'settings':
        switch (action) {
          case 'get':
            result = await supa.from('settings').select('*').maybeSingle();
            break;
          case 'save':
            result = await supa.from('settings').upsert([data]).select();
            break;
          default:
            return res.status(400).json({ error: 'Invalid action for settings' });
        }
        break;

      default:
        return res.status(400).json({ error: `Unknown entity: ${entity}` });
    }

    if (result && result.error) {
      return res.status(500).json({ error: result.error.message });
    }

    return res.status(200).json(result);
  } catch (err) {
    console.error('Supabase proxy error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
}