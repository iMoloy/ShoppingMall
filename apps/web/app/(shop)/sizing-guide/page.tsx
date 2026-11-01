import type { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Sizing & Atelier Care Guide | Shopping Mall',
  description:
    'Find your ideal fit with our sizing charts for clothing, leather bags, and watch case diameters.',
}

export default function SizingGuidePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-20">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
        <Link href="/" className="hover:text-[var(--color-text-primary)]">Home</Link>
        <span>/</span>
        <span className="text-[var(--color-text-primary)]">Sizing &amp; Care</span>
      </nav>

      {/* Header */}
      <div className="border-b border-[var(--color-border)] pb-8">
        <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-brand-600)]">
          Atelier Craft &amp; Sizing
        </span>
        <h1 className="mt-3 text-3xl font-extrabold uppercase tracking-tight text-[var(--color-text-primary)] sm:text-5xl">
          Sizing &amp; Care Guide
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[var(--color-text-muted)] sm:text-base">
          Our garments and accessories are crafted according to European luxury standards.
          Refer to our measurement charts and material maintenance guidelines below.
        </p>
      </div>

      {/* Clothing Sizing Table */}
      <div className="mt-12 space-y-6">
        <h2 className="text-lg font-bold uppercase tracking-wider text-[var(--color-text-primary)]">
          Tailored Clothing Sizing Chart
        </h2>
        <div className="overflow-x-auto rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[var(--color-border)] bg-[var(--color-surface-raised)] uppercase text-[var(--color-text-muted)]">
              <tr>
                <th className="px-4 py-3 font-semibold">Size</th>
                <th className="px-4 py-3 font-semibold">US / UK</th>
                <th className="px-4 py-3 font-semibold">EU</th>
                <th className="px-4 py-3 font-semibold">Chest (Inches)</th>
                <th className="px-4 py-3 font-semibold">Waist (Inches)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              <tr>
                <td className="px-4 py-3 font-bold text-[var(--color-text-primary)]">XS</td>
                <td className="px-4 py-3 text-[var(--color-text-muted)]">34</td>
                <td className="px-4 py-3 text-[var(--color-text-muted)]">44</td>
                <td className="px-4 py-3 text-[var(--color-text-muted)]">34 - 36</td>
                <td className="px-4 py-3 text-[var(--color-text-muted)]">28 - 30</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-bold text-[var(--color-text-primary)]">S</td>
                <td className="px-4 py-3 text-[var(--color-text-muted)]">36</td>
                <td className="px-4 py-3 text-[var(--color-text-muted)]">46</td>
                <td className="px-4 py-3 text-[var(--color-text-muted)]">36 - 38</td>
                <td className="px-4 py-3 text-[var(--color-text-muted)]">30 - 32</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-bold text-[var(--color-text-primary)]">M</td>
                <td className="px-4 py-3 text-[var(--color-text-muted)]">38</td>
                <td className="px-4 py-3 text-[var(--color-text-muted)]">48</td>
                <td className="px-4 py-3 text-[var(--color-text-muted)]">38 - 40</td>
                <td className="px-4 py-3 text-[var(--color-text-muted)]">32 - 34</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-bold text-[var(--color-text-primary)]">L</td>
                <td className="px-4 py-3 text-[var(--color-text-muted)]">40</td>
                <td className="px-4 py-3 text-[var(--color-text-muted)]">50</td>
                <td className="px-4 py-3 text-[var(--color-text-muted)]">40 - 42</td>
                <td className="px-4 py-3 text-[var(--color-text-muted)]">34 - 36</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-bold text-[var(--color-text-primary)]">XL</td>
                <td className="px-4 py-3 text-[var(--color-text-muted)]">42</td>
                <td className="px-4 py-3 text-[var(--color-text-muted)]">52</td>
                <td className="px-4 py-3 text-[var(--color-text-muted)]">42 - 44</td>
                <td className="px-4 py-3 text-[var(--color-text-muted)]">36 - 38</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Watch Case Diameter & Bag Dimensions */}
      <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Watch Guide */}
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-6">
          <h3 className="text-base font-bold uppercase text-[var(--color-text-primary)]">
            Watch Case Proportions
          </h3>
          <p className="mt-2 text-xs leading-relaxed text-[var(--color-text-muted)]">
            Our luxury timepieces are proportioned for wrist versatility:
          </p>
          <ul className="mt-4 space-y-2 text-xs text-[var(--color-text-muted)]">
            <li><strong>38mm:</strong> Ideal for smaller to medium wrists (5.5&quot;–6.5&quot;).</li>
            <li><strong>40mm:</strong> Classic modern unisex standard (6.25&quot;–7.25&quot;).</li>
            <li><strong>42mm:</strong> Architectural chronograph presence (7.0&quot;+).</li>
          </ul>
        </div>

        {/* Bag Sizes */}
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-6">
          <h3 className="text-base font-bold uppercase text-[var(--color-text-primary)]">
            Handbag Capacity Reference
          </h3>
          <p className="mt-2 text-xs leading-relaxed text-[var(--color-text-muted)]">
            Dimensions for daily carry:
          </p>
          <ul className="mt-4 space-y-2 text-xs text-[var(--color-text-muted)]">
            <li><strong>Clutch &amp; Crossbody:</strong> Fits iPhone Pro Max, cardholder, cosmetics.</li>
            <li><strong>Shoulder Bag:</strong> Fits iPad Mini, water bottle, sunglasses case.</li>
            <li><strong>Bespoke Tote:</strong> Fits 15&quot; MacBook, documents, jacket, tech pouch.</li>
          </ul>
        </div>
      </div>

      {/* Material Care */}
      <div className="mt-14 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8">
        <h3 className="text-base font-bold uppercase text-[var(--color-text-primary)]">
          Atelier Care &amp; Longevity
        </h3>
        <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-3 text-xs text-[var(--color-text-muted)]">
          <div>
            <h4 className="font-semibold text-[var(--color-text-primary)]">Full-Grain Leather</h4>
            <p className="mt-1 leading-relaxed">
              Store in provided dust bag away from direct sunlight. Treat with natural wax conditioner every 6 months.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-[var(--color-text-primary)]">Sapphire &amp; Steel</h4>
            <p className="mt-1 leading-relaxed">
              Rinse with freshwater after saltwater immersion. Wipe crystal clean with microfiber cloth only.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-[var(--color-text-primary)]">Linen &amp; Virgin Wool</h4>
            <p className="mt-1 leading-relaxed">
              Dry clean recommended. Steam lightly to remove travel creases; avoid direct iron contact.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-12 text-center">
        <Button asChild variant="primary" size="lg">
          <Link href="/products">Explore The Collection</Link>
        </Button>
      </div>
    </div>
  )
}
