// TODO: draft wording. Needs review before launch.
import { Link } from 'react-router-dom'
import { PolicyLayout } from './PolicyLayout'

export function Terms() {
  return (
    <PolicyLayout title="Terms and Conditions" intro="The simple ground rules for shopping with Adore Hive.">
      <section>
        <h2>Orders</h2>
        <p>When you place an order you are asking to buy the items in your bag. We confirm your order once we have checked your details and the items.</p>
      </section>
      <section>
        <h2>Prices</h2>
        <p>Prices are shown in Indian rupees.</p>
      </section>
      <section>
        <h2>Handmade items</h2>
        <p>Handmade items can vary slightly in colour, size and finish. That is part of their charm.</p>
      </section>
      <section>
        <h2>Delivery and returns</h2>
        <p>Please see our <Link to="/policies/shipping">Shipping Policy</Link> and our <Link to="/policies/returns">Return and Exchange Policy</Link>.</p>
      </section>
      <section>
        <h2>Your information</h2>
        <p>How we handle your details is explained in our <Link to="/policies/privacy">Privacy Policy</Link>.</p>
      </section>
    </PolicyLayout>
  )
}
