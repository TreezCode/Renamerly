-- Function to update subscription tier from webhooks
-- This is a security definer function that bypasses RLS
-- It's safe because it's in a private schema and only accessible via Edge Functions

CREATE SCHEMA IF NOT EXISTS private;

-- Revoke access from public roles
REVOKE ALL ON SCHEMA private FROM public, anon, authenticated;

-- Function to update user subscription tier
CREATE OR REPLACE FUNCTION private.update_subscription_tier(
  p_user_id UUID,
  p_tier TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_result JSONB;
BEGIN
  -- Validate tier
  IF p_tier NOT IN ('free', 'pro') THEN
    RAISE EXCEPTION 'Invalid subscription tier: %', p_tier;
  END IF;

  -- Update the user profile
  UPDATE public.user_profiles
  SET 
    subscription_tier = p_tier,
    updated_at = NOW()
  WHERE id = p_user_id
  RETURNING jsonb_build_object(
    'id', id,
    'subscription_tier', subscription_tier,
    'updated_at', updated_at
  ) INTO v_result;

  -- Check if update was successful
  IF v_result IS NULL THEN
    RAISE EXCEPTION 'User profile not found for user_id: %', p_user_id;
  END IF;

  RETURN v_result;
END;
$$;

-- Grant execute permission to authenticated users (for Edge Functions)
GRANT EXECUTE ON FUNCTION private.update_subscription_tier(UUID, TEXT) TO authenticated;

-- Add helpful comment
COMMENT ON FUNCTION private.update_subscription_tier IS 
'Updates user subscription tier. Used by Stripe webhooks via Edge Functions. Security definer to bypass RLS.';
