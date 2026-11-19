// TODO: draft wording. Needs review before launch.
import { PolicyLayout } from './PolicyLayout'

export function Privacy() {
  return (
    <PolicyLayout title="Privacy Policy" intro="What we collect when you shop with us, and what we do with it.">
      <section>
        <h2>What we collect</h2>
        <ul>
          <li>Your name, email address, phone number and delivery address.</li>
          <li>Your order details, including any gift note or personalization you add.</li>
          <li>Anything you write to us through the contact or request forms.</li>
        </ul>
      </section>
      <section>
        <h2>How we use it</h2>
        <p>We use this information to process and deliver your orders, to contact you about an order, and to reply to your messages.</p>
      </section>
      <section>
        <h2>Payments</h2>
        <p>Payments are handled by our payment provider. We do not store your card or UPI details.</p>
      </section>
      <section>
        <h2>On your device</h2>
        <p>Your bag, wishlist and checkout details are kept in your browser on this device so they are still there when you come back.</p>
      </section>
    </PolicyLayout>
  )
}
