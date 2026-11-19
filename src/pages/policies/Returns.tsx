import { Link } from 'react-router-dom'
import { REFUND_DAYS, RETURN_DAYS, RETURN_FEE, RETURN_PICKUP_DAYS, RETURN_SELF_SHIP_DAYS } from '@/config/shop'
import { formatINR } from '@/lib/format'
import { meta } from '@/seo/routes'
import { PolicyLayout } from './PolicyLayout'

export function Returns() {
  return (
    <PolicyLayout title={meta.returns.title} intro={meta.returns.description}>
      <section>
        <h2>Returns</h2>
        <p>We accept returns within {RETURN_DAYS} days of delivery. A return fee of {formatINR(RETURN_FEE)} applies.</p>
      </section>
      <section>
        <h2>What can be returned</h2>
        <ul>
          <li>Items must be unused and unworn, in their original condition, with tags and packaging intact.</li>
          <li>Damaged, soiled or altered items are not accepted. They are sent back to you, and shipping charges apply.</li>
          <li>Sale and discounted items are not eligible for returns.</li>
        </ul>
      </section>
      <section>
        <h2>How the return gets to us</h2>
        <ul>
          <li>In selected locations, and depending on courier serviceability, we arrange a reverse pickup within {RETURN_PICKUP_DAYS.min} to {RETURN_PICKUP_DAYS.max} business days of approving your return.</li>
          <li>Where pickup isn’t available, you send the item back yourself within {RETURN_SELF_SHIP_DAYS} days of approval.</li>
        </ul>
      </section>
      <section>
        <h2>Refunds</h2>
        <p>Once your returned item passes inspection, your refund is issued within {REFUND_DAYS} days.</p>
      </section>
      <section>
        {/* TODO(owner): confirm the cancellation rules. Nothing specific is promised until then. */}
        <h2>Cancellations</h2>
        <p>If you need to cancel an order, please contact us as soon as you can and we will tell you whether it can still be cancelled. See also our <Link to="/policies/shipping">Shipping Policy</Link>.</p>
      </section>
    </PolicyLayout>
  )
}
