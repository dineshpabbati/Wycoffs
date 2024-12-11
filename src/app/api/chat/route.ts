import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { query } = await req.json();

        // Forward the query to the FastAPI backend
        const response = await fetch('http://localhost:8000/generate-response/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query }),
        });

        if (!response.ok) {
            throw new Error(`FastAPI backend error: ${response.statusText}`);
        }

        const data = await response.json();
        return NextResponse.json({ response: data.response });
    } catch (error) {
        console.error('Error in Next.js API route:', error);
        return NextResponse.json({ error: 'Failed to fetch response from backend' }, { status: 500 });
    }
}
