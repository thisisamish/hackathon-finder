import { NextRequest, NextResponse } from 'next/server';
import { findDevfolioHackathons } from '@/app/utils/findDevfolioHackathons';

export async function GET(request: NextRequest) {
	const hackathons = await findDevfolioHackathons();

	return NextResponse.json(hackathons);
}
