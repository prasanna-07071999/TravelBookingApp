
import { Suspense } from 'react';
import CheckoutPage from '@/components/CheckOutPage';

export default function CheckoutPageWrapper() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-gray-600">Loading checkout page...</div>}>
      <CheckoutPage />
    </Suspense>
  );
}



