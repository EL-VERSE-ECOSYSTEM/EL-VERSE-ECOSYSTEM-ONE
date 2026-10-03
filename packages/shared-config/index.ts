export const config = {
  appName: 'EL VERSE ECOSYSTEM',
  defaultArm: 'elverse',
  version: '1.0.0',
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://kipafxeitjrlqtdhzhse.supabase.co',
    publishableKey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '',
  },
  validateEnv() {
    if (!this.supabase.url) {
      throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL');
    }
  },
};
