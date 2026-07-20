import crypto from "crypto";

const LS_API = "https://api.lemonsqueezy.com/v1";

/**
 * Creates a Lemon Squeezy hosted checkout for a job posting.
 * Requires a single LS "product variant" priced at the standard rate; the
 * featured add-on is applied as custom pricing via `variant.price` override
 * (works because we enable "Pay what you want"-style custom price on the
 * variant, or alternatively you can create a second $99 variant named
 * "Standard + Featured" in the LS dashboard and pass its id when featured=true).
 */
export async function createCheckout(params: {
  jobId: number;
  editToken: string;
  featured: boolean;
  companyEmail: string;
  jobTitle: string;
}) {
  const apiKey = process.env.LEMONSQUEEZY_API_KEY;
  const storeId = process.env.LEMONSQUEEZY_STORE_ID;
  const standardVariantId = process.env.LEMONSQUEEZY_VARIANT_STANDARD;
  const featuredVariantId = process.env.LEMONSQUEEZY_VARIANT_FEATURED;

  if (!apiKey || !storeId || !standardVariantId) {
    throw new Error(
      "Lemon Squeezy env vars missing (LEMONSQUEEZY_API_KEY, LEMONSQUEEZY_STORE_ID, LEMONSQUEEZY_VARIANT_STANDARD[, LEMONSQUEEZY_VARIANT_FEATURED])."
    );
  }

  const variantId =
    params.featured && featuredVariantId ? featuredVariantId : standardVariantId;

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const res = await fetch(`${LS_API}/checkouts`, {
    method: "POST",
    headers: {
      Accept: "application/vnd.api+json",
      "Content-Type": "application/vnd.api+json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      data: {
        type: "checkouts",
        attributes: {
          checkout_data: {
            email: params.companyEmail,
            custom: {
              job_id: String(params.jobId),
              edit_token: params.editToken,
              featured: String(params.featured),
            },
          },
          product_options: {
            name: `Job posting: ${params.jobTitle}`,
            redirect_url: `${baseUrl}/post-job/success?token=${params.editToken}`,
          },
        },
        relationships: {
          store: { data: { type: "stores", id: storeId } },
          variant: { data: { type: "variants", id: variantId } },
        },
      },
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Lemon Squeezy checkout failed: ${res.status} ${body}`);
  }

  const json = await res.json();
  return json.data.attributes.url as string;
}

export function verifyWebhookSignature(rawBody: string, signature: string | null) {
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
  if (!secret || !signature) return false;
  const hmac = crypto.createHmac("sha256", secret);
  const digest = hmac.update(rawBody).digest("hex");
  try {
    return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature));
  } catch {
    return false;
  }
}