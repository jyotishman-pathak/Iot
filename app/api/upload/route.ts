import { prisma } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    console.log('Incoming data:', data);

    if (!data?.BME) {
      return new Response(JSON.stringify({ success: false, error: 'Missing BME data' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const entry = await prisma.sensorReading.create({
      data: {
        sensor: "BME",
        temperature: data.BME.temperature,
        humidity: data.BME.humidity,
        pressure: data.BME.pressure,
        
      },
    });

    return new Response(JSON.stringify({ success: true, entry }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('Upload error:', err);
    return new Response(JSON.stringify({ success: false, error: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
