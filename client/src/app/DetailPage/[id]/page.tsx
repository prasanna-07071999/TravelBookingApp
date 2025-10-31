'use client';

import { useParams, useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai';
import { getExperienceById } from '@/lib/api';


interface Experience {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  availableDates: { date: string; times: string[] }[];
}


export default function DetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const router = useRouter();
  const [experience, setExperience] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    async function fetchExperience() {
      try {
        setLoading(true);
        const data = await getExperienceById(id);
        setExperience(data);
      } catch (err) {
        console.error('Error fetching experience:', err);
        setError('Failed to load experience');
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchExperience();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[90vh] flex items-center justify-center text-gray-600">
        Loading experience details...
      </div>
    );
  }

  if (error || !experience) {
    return (
      <div className="min-h-[90vh] flex items-center justify-center text-red-600">
        {error ?? 'Experience not found'}
      </div>
    );
  }

 const uniqueDates = Array.from(
  new Set((experience.slots ?? []).map((slot: any) => slot.date))) as string[];

  const filteredSlots = selectedDate
    ? (experience.slots ?? []).filter((slot: any) => slot.date === selectedDate)
    : [];

  const canConfirm = selectedDate && selectedTime;

  const incrementQuantity = () => setQuantity(q => q + 1);
  const decrementQuantity = () => setQuantity(q => (q > 1 ? q - 1 : 1));

  const subtotal = quantity * (experience.price ?? 0);
  const taxes = 59;
  const total = subtotal + taxes;

  const handleConfirm = () => {
    if (!selectedDate || !selectedTime) {
      alert('Please select date and time before confirming.');
      return;
    }

    const query = new URLSearchParams({
      title: experience.title,
      price: experience.price.toString(),
      date: selectedDate,
      time: selectedTime,
      qty: quantity.toString(),
    }).toString();

    router.push(`/CheckoutPage?${query}`);
  };

  return (
    <div className="min-h-[90vh] bg-[#f6f7fb] px-2 py-8">
      <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto">
        <div className="md:w-7/12 w-full">
          <img
            src={experience.imageUrl}
            alt={experience.title}
            className="rounded-xl h-80 w-full object-cover shadow-md"
          />
        </div>

        <div className="md:w-4/12 w-full bg-white rounded-xl p-6 shadow-md self-start">
          <div className="mb-2 flex justify-between text-gray-500 text-sm">
            <span>Starts at</span>
            <span className="text-gray-900 font-semibold">₹{experience.price}</span>
          </div>

          <div className="mb-2 flex justify-between items-center text-gray-500 text-sm">
            <span>Quantity</span>
            <span className="flex gap-2 items-center">
              <button
                onClick={decrementQuantity}
                className="p-1 bg-gray-200 rounded hover:bg-gray-300"
                aria-label="Decrease quantity"
              >
                <AiOutlineMinus size={20} />
              </button>
              <span>{quantity}</span>
              <button
                onClick={incrementQuantity}
                className="p-1 bg-gray-200 rounded hover:bg-gray-300"
                aria-label="Increase quantity"
              >
                <AiOutlinePlus size={20} />
              </button>
            </span>
          </div>

          <div className="mb-2 flex justify-between text-gray-500 text-sm">
            <span>Subtotal</span>
            <span className="text-gray-900 font-semibold">₹{subtotal}</span>
          </div>

          <div className="mb-2 flex justify-between text-gray-500 text-sm">
            <span>Taxes</span>
            <span>₹{taxes}</span>
          </div>

          <div className="border-t border-gray-200 my-3"></div>

          <div className="mb-2 flex justify-between text-lg font-semibold">
            <span>Total</span>
            <span>₹{total}</span>
          </div>

          <button
            className={`w-full rounded-md py-2 mt-3 font-bold ${
              canConfirm ? 'bg-yellow-400 text-black' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
            disabled={!canConfirm}
            onClick={handleConfirm}
          >
            Confirm
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-8">
        <h1 className="text-xl font-semibold mb-2">{experience.title}</h1>
        <p className="text-gray-700 mb-4">{experience.description}</p>

        <div className="mb-6">
          <label className="font-medium mb-2 block text-yellow-600">Choose date</label>
          <div className="flex gap-2 flex-wrap max-w-full overflow-x-auto">
            {uniqueDates.length > 0 ? (
              uniqueDates.map((date: string) => (
                <button
                  key={date}
                  onClick={() => {
                    setSelectedDate(date);
                    setSelectedTime(null);
                  }}
                  className={`border px-4 py-2 rounded min-w-[68px] font-semibold ${
                    selectedDate === date
                      ? 'bg-yellow-400 text-black border-yellow-400'
                      : 'border-yellow-300 bg-yellow-100 text-gray-800'
                  }`}
                >
                  {date}
                </button>
              ))
            ) : (
              <span className="text-gray-500">No available dates</span>
            )}
          </div>
        </div>

        <div className="mb-6">
          <label className="font-medium mb-2 block text-gray-700">Choose time</label>
          <div className="flex gap-2 flex-wrap">
            {filteredSlots.length > 0 ? (
              filteredSlots.map((slot: any) => (
                <button
                  key={slot._id}
                  disabled={slot.isBooked}
                  onClick={() => setSelectedTime(slot.time)}
                  className={`px-4 py-2 rounded border text-sm font-medium min-w-[88px] ${
                    slot.isBooked
                      ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                      : selectedTime === slot.time
                      ? 'bg-yellow-400 text-black border-yellow-400'
                      : 'bg-white border-gray-300 text-gray-800'
                  }`}
                >
                  {slot.time}
                  {slot.isBooked && (
                    <span className="ml-1 text-red-500 text-xs">Booked</span>
                  )}
                </button>
              ))
            ) : (
              <span className="text-gray-500">Please select a date first</span>
            )}
          </div>
          <div className="text-[11px] text-gray-400 mt-2">All times are in IST (GMT +5:30)</div>
        </div>

        <div className="mt-6 bg-gray-100 p-3 rounded">
          <h2 className="font-semibold mb-1">About</h2>
          <div className="text-sm text-gray-500">
            {experience.about || 'Scenic routes, trained guides, and safety briefing. Minimum age 10.'}
          </div>
        </div>
      </div>
    </div>
  );
}
