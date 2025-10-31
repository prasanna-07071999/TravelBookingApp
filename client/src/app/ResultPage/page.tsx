'use client';

import { useRouter } from 'next/navigation';
import { FaCheckCircle } from 'react-icons/fa';

export default function ResultPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#f6f7fb]">
      <div className="flex flex-col items-center justify-center h-[80vh]">
        <FaCheckCircle className="text-green-500 text-6xl mb-4" />
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">
          Booking Confirmed
        </h1>
        <p className="text-gray-600 mb-6">Ref ID: HUF56&SO</p>
        <button
          onClick={() => router.push('/')}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-md font-medium"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
