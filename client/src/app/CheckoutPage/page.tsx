'use client';

import React, { useState } from 'react';
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai';
import { useRouter, useSearchParams } from 'next/navigation';

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const title = searchParams.get('title') || 'Kayaking';
  const price = parseInt(searchParams.get('price') || '999', 10);
  const date = searchParams.get('date') || '2025-10-22';
  const time = searchParams.get('time') || '09:00 am';
  const qtyParam = parseInt(searchParams.get('qty') || '1', 10);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [promo, setPromo] = useState('');
  const [discount, setDiscount] = useState(0);
  const [discountType, setDiscountType] = useState<'percent' | 'flat' | null>(null);
  const [message, setMessage] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [qty, setQty] = useState<number>(qtyParam);
  const [isApplying, setIsApplying] = useState(false);

  const taxes = 59;
  const subtotal = price * qty;

  const discountedAmount =
    discountType === 'percent' ? (subtotal * discount) / 100 : discountType === 'flat' ? discount : 0;

  const total = Math.max(subtotal - discountedAmount + taxes, 0);

  const incrementQty = () => setQty(q => q + 1);
  const decrementQty = () => setQty(q => (q > 1 ? q - 1 : 1));

  const handleApplyPromo = async () => {
    if (!promo.trim()) {
      setMessage('Please enter a promo code.');
      return;
    }

    try {
      setIsApplying(true);
      setMessage('');

      const response = await fetch('http://localhost:5000/promo/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: promo.trim() }),
      });

      const data = await response.json();

      if (response.ok && data.valid) {
        setDiscount(data.discount);
        setDiscountType(data.type || 'percent');
        setMessage(
          `Promo applied! ${
            data.type === 'flat' ? `₹${data.discount} off` : `${data.discount}% discount`
          }`
        );
      } else {
        setDiscount(0);
        setDiscountType(null);
        setMessage('Invalid promo code.');
      }
    } catch (error) {
      console.error('Promo validation failed:', error);
      setMessage('Error validating promo code. Please try again.');
    } finally {
      setIsApplying(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!agreed) {
      alert('Please agree to the terms and safety policy.');
      return;
    }
    try {
      await fetch('http://localhost:5000/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fullName,
          email,
          title,
          date,
          time,
          qty,
          subtotal,
          taxes,
          discount,
          total,
        }),
      });
      router.push('/ResultPage');
    } catch (error) {
      console.error('Checkout failed:', error);
      alert('Checkout failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f7fb]">
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col lg:flex-row gap-10">
        {/* Left Section */}
        <div className="bg-white rounded-lg shadow p-7 flex-1 min-w-[340px]">
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => router.back()}
              className="text-lg text-gray-600 hover:text-gray-900"
            >
              ←
            </button>
            <h2 className="text-lg font-semibold text-gray-800">Checkout</h2>
          </div>

          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Your name"
                value={fullName}
                required
                onChange={e => setFullName(e.target.value)}
                className="w-full bg-gray-100 px-4 py-3 border outline-none rounded text-sm focus:ring-2 focus:ring-yellow-400"
              />
              <input
                type="email"
                placeholder="Your email"
                value={email}
                required
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-gray-100 px-4 py-3 border outline-none rounded text-sm focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Promo code"
                value={promo}
                disabled={!!discount}
                onChange={e => setPromo(e.target.value)}
                className={`w-full bg-gray-100 px-4 py-3 border outline-none rounded text-sm ${
                  discount ? 'cursor-not-allowed opacity-70' : ''
                }`}
              />
              <button
                type="button"
                onClick={handleApplyPromo}
                disabled={isApplying || !!discount}
                className={`bg-black text-white rounded px-6 py-3 font-semibold hover:bg-gray-800 ${
                  (isApplying || discount) && 'opacity-50 cursor-not-allowed'
                }`}
              >
                {discount ? 'Applied' : isApplying ? 'Applying...' : 'Apply'}
              </button>
            </div>

            {message && (
              <p
                className={`text-sm mt-1 ${
                  message.includes('discount') || message.includes('off')
                    ? 'text-green-600'
                    : 'text-red-500'
                }`}
              >
                {message}
              </p>
            )}

            <div className="flex items-center mt-2 text-sm">
              <input
                type="checkbox"
                checked={agreed}
                onChange={e => setAgreed(e.target.checked)}
                id="agree"
                className="mr-2 accent-yellow-400"
              />
              <label htmlFor="agree" className="text-gray-500">
                I agree to the terms and safety policy
              </label>
            </div>

            <button
              type="submit"
              className={`w-full mt-4 py-3 rounded text-lg font-semibold transition-colors ${
                agreed
                  ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-500'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
              disabled={!agreed}
            >
              Pay and Confirm
            </button>
          </form>
        </div>

        {/* Right Section - Summary */}
        <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-[375px] self-start">
          <div className="grid grid-cols-2 gap-y-1 gap-x-4 text-sm text-gray-700 mb-4">
            <span className="font-medium">Experience</span>
            <span className="text-right">{title}</span>
            <span className="font-medium">Date</span>
            <span className="text-right">{date}</span>
            <span className="font-medium">Time</span>
            <span className="text-right">{time}</span>
            <span className="font-medium">Qty</span>
            <span className="text-right flex items-center justify-end gap-2">
              <button
                onClick={decrementQty}
                type="button"
                className="p-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                <AiOutlineMinus size={16} />
              </button>
              <span>{qty}</span>
              <button
                onClick={incrementQty}
                type="button"
                className="p-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                <AiOutlinePlus size={16} />
              </button>
            </span>
          </div>

          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-sm text-green-600 mb-1">
              <span>
                Discount{' '}
                {discountType === 'percent' ? `(${discount}%)` : `(₹${discount})`}
              </span>
              <span>-₹{discountedAmount.toFixed(0)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Taxes</span>
            <span>₹{taxes}</span>
          </div>

          <div className="border-t border-gray-200 mb-3 mt-2"></div>

          <div className="flex justify-between text-lg font-semibold mb-5">
            <span>Total</span>
            <span>₹{total.toFixed(0)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
