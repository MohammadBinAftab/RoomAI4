import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function getUserCredits(userId: string) {
  const { data, error } = await supabase
    .from('credits')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGSQL_NO_ROWS_RETURNED') throw error;
  return data || { available_credits: 0, lifetime_credits: 0 };
}

export async function updateUserCredits(
  userId: string, 
  amount: number, 
  type: 'purchase' | 'usage' | 'refund' | 'bonus' | 'expiry', 
  description?: string
) {
  const { data: credits } = await supabase
    .from('credits')
    .select('available_credits, lifetime_credits')
    .eq('user_id', userId)
    .single();

  if (!credits) {
    // Create initial credits record
    await supabase
      .from('credits')
      .insert({
        user_id: userId,
        available_credits: Math.max(0, amount),
        lifetime_credits: Math.max(0, amount)
      });
  } else {
    // Update existing credits
    await supabase
      .from('credits')
      .update({
        available_credits: Math.max(0, credits.available_credits + amount),
        lifetime_credits: credits.lifetime_credits + Math.max(0, amount),
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId);
  }

  // Log the transaction
  await supabase
    .from('credit_transactions')
    .insert({
      user_id: userId,
      amount,
      type,
      description
    });
}

// Get user's transaction history
export async function getUserTransactions(userId: string) {
  const { data, error } = await supabase
    .from('credit_transactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

// Get user's credit balance
export async function getCreditBalance(userId: string) {
  const { data, error } = await supabase
    .from('credits')
    .select('available_credits')
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGSQL_NO_ROWS_RETURNED') throw error;
  return data?.available_credits || 0;
}
