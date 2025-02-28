import { NextResponse } from 'next/server';
import { getEnvironmentVariable } from '../../../../../src/modules/admin/env.service';

export const runtime = 'node';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();
    console.log('Verifying credentials for username:', username);

    // Récupérer les identifiants depuis MongoDB
    const storedUsername = await getEnvironmentVariable('HTTP_BASIC_AUTH_USERNAME');
    const storedPassword = await getEnvironmentVariable('HTTP_BASIC_AUTH_PASSWORD');
    console.log('Stored credentials:', { 
      storedUsername: storedUsername || '(not set)', 
      hasStoredPassword: !!storedPassword 
    });

    // Vérifier si les identifiants correspondent
    const isValid = storedUsername && storedPassword && 
                   username === storedUsername && 
                   password === storedPassword;

    console.log('Verification result:', { isValid });
    return NextResponse.json({ isValid });
  } catch (error) {
    console.error('Error verifying credentials:', error);
    return NextResponse.json({ isValid: false });
  }
} 