// Lemon Squeezy Configuration

// Get API key from environment variable
export const LEMON_SQUEEZY_API_KEY = import.meta.env.VITE_LEMON_SQUEEZY_API_KEY || ''
export const LEMON_SQUEEZY_STORE_ID = import.meta.env.VITE_LEMON_SQUEEZY_STORE_ID || ''

// Check if Lemon Squeezy is configured
export const isLemonSqueezyConfigured = () => {
  return LEMON_SQUEEZY_API_KEY !== '' && LEMON_SQUEEZY_STORE_ID !== ''
}

// Create checkout URL for a product
export const createCheckoutUrl = async (productId, userId, productPrice, productName) => {
  if (!isLemonSqueezyConfigured()) {
    console.warn('Lemon Squeezy not configured - using demo mode')
    return null
  }

  try {
    // For now, we'll use a demo mode
    // In production, you would call Lemon Squeezy API to create checkout
    // This is a placeholder that simulates the checkout flow
    
    // The actual Lemon Squeezy checkout URL would look like:
    // https://yourstore.lemonsqueezy.com/checkout/buy/product-id
    
    return {
      checkoutUrl: `https://demo-checkout.lemonsqueezy.com?product=${productId}&user=${userId}`,
      demoMode: true
    }
  } catch (error) {
    console.error('Error creating checkout:', error)
    return null
  }
}

// Verify webhook signature (for security)
export const verifyWebhookSignature = (payload, signature, secret) => {
  // In production, you would verify the webhook signature here
  // using HMAC SHA256 with your webhook secret
  // For now, we'll return true in demo mode
  return true
}

// Parse webhook event
export const parseWebhookEvent = (payload) => {
  try {
    return {
      eventType: payload.meta?.event_name || 'order_created',
      orderId: payload.data?.id || 'demo-order-' + Date.now(),
      customerId: payload.data?.attributes?.customer_id,
      productId: payload.meta?.custom_data?.product_id,
      userId: payload.meta?.custom_data?.user_id,
      status: payload.data?.attributes?.status || 'paid',
      totalUsd: payload.data?.attributes?.total_usd || 0,
    }
  } catch (error) {
    console.error('Error parsing webhook:', error)
    return null
  }
}

// Demo mode: Simulate a successful purchase
export const simulatePurchase = async (productId, userId, supabase) => {
  try {
    // Create transaction record
    const { data: transaction, error: txError } = await supabase
      .from('transactions')
      .insert([
        {
          user_id: userId,
          product_id: productId,
          order_id: 'demo-' + Date.now(),
          payment_status: 'Completed',
        }
      ])
      .select()
      .single()

    if (txError) throw txError

    // Add product to user's saved_products
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('saved_products')
      .eq('id', userId)
      .single()

    if (userError) throw userError

    const updatedProducts = [...(user.saved_products || []), productId]

    const { error: updateError } = await supabase
      .from('users')
      .update({ saved_products: updatedProducts })
      .eq('id', userId)

    if (updateError) throw updateError

    return { success: true, transaction }
  } catch (error) {
    console.error('Error simulating purchase:', error)
    return { success: false, error }
  }
}

// Check if user owns a product
export const userOwnsProduct = async (userId, productId, supabase) => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('saved_products')
      .eq('id', userId)
      .single()

    if (error) throw error

    return user.saved_products?.includes(productId) || false
  } catch (error) {
    console.error('Error checking product ownership:', error)
    return false
  }
}

// Get user's transactions
export const getUserTransactions = async (userId, supabase) => {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select(`
        *,
        products (*)
      `)
      .eq('user_id', userId)
      .order('purchased_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching transactions:', error)
    return []
  }
}
