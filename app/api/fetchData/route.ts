
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const sensorData = await prisma.sensorReading.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 100, 
    });

    return NextResponse.json(sensorData);
  } catch (error) {
    console.error("Error fetching sensor data:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
