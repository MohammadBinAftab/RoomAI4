
  # Credits System Schema

  1. New Tables
    - credits
      - user_id (uuid, primary key) - References auth.users
      - available_credits (integer) - Current balance
      - lifetime_credits (integer) - Total credits ever received
      - created_at (timestamp)
      - updated_at (timestamp)
    
    - credit_transactions
      - id (uuid, primary key)
      - user_id (uuid) - References auth.users
      - amount (integer) - Credit amount (positive or negative)
      - type (enum) - Transaction type
      - description (text, optional)
      - created_at (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for users to read their own data
    - Add policies for the service role to manage credits

-- Create credits table
CREATE TABLE IF NOT EXISTS credits (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id),
    available_credits INTEGER NOT NULL DEFAULT 0,
    lifetime_credits INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT credits_available_credits_check CHECK (available_credits >= 0),
    CONSTRAINT credits_lifetime_credits_check CHECK (lifetime_credits >= 0)
);

-- Create transaction type enum
CREATE TYPE credit_transaction_type AS ENUM (
    'purchase',
    'usage',
    'refund',
    'bonus',
    'expiry'
);

-- Create credit transactions table
CREATE TABLE IF NOT EXISTS credit_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    amount INTEGER NOT NULL,
    type credit_transaction_type NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;

-- Policies for credits table
CREATE POLICY "Users can view their own credits"
    ON credits
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all credits"
    ON credits
    TO service_role
    USING (true);

-- Policies for credit_transactions table
CREATE POLICY "Users can view their own transactions"
    ON credit_transactions
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all transactions"
    ON credit_transactions
    TO service_role
    USING (true);

Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updating updated_at
CREATE TRIGGER update_credits_updated_at
    BEFORE UPDATE ON credits
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();