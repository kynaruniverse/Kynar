export const LEMON_SQUEEZY_API_KEY = import.meta.env.VITE_LEMON_SQUEEZY_API_KEY
export const LEMON_SQUEEZY_STORE_ID = import.meta.env.VITE_LEMON_SQUEEZY_STORE_ID

export const isLemonSqueezyConfigured = Boolean(LEMON_SQUEEZY_API_KEY && LEMON_SQUEEZY_STORE_ID)

/**
 * Generates a checkout URL for the Lemon Squeezy hosted checkout.
 */
export const createCheckoutUrl = async (productId, userId) => {
  if (!isLemonSqueezyConfigured) {
    return {
      url: `https://demo-checkout.lemonsqueezy.com?product=${productId}&user=${userId}`,
      isDemo: true
    }
  }
  
  // Logic for real API call to Lemon Squeezy goes here
  return { url: '', isDemo: false }
}

/**
 * Standardizes the webhook payload regardless of source.
 */
export const transformWebhookPayload = (payload) => {
  return {
    eventType: payload.meta?.event_name,
    orderId: payload.data?.id,
    productId: payload.meta?.custom_data?.product_id,
    userId: payload.meta?.custom_data?.user_id,
    status: payload.data?.attributes?.status,
  }
}
