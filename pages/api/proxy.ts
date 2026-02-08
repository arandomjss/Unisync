import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const {
        data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
        return res.redirect('/?login=true');
    }

    const { path } = req.query;
    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}${path}`, {
    method: req.method,
    headers: {
        ...Object.fromEntries(Object.entries(req.headers).map(([key, value]) => [key, String(value)])),
        Authorization: `Bearer ${session.access_token}`,
    },
    body: req.body,
});

    const data = await response.json();
    res.status(response.status).json(data);
}