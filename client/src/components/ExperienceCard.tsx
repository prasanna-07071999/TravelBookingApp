'use client';

import { useRouter } from 'next/navigation';
import { Experience } from '../types/experience';

interface ExperienceCardProps {
  experience: Experience;
}

export default function ExperienceCard({ experience }: ExperienceCardProps) {
  const router = useRouter();

  function handleViewDetails() {
    router.push(`/DetailPage/${experience._id}`);
  }

  return (
    <div className="rounded-xl bg-white shadow-md border border-gray-200 hover:ring-2 ring-yellow-400 transition flex flex-col w-full max-w-xs mx-auto">
      {experience.imageUrl && (
        <img
          src={experience.imageUrl}
          alt={experience.title}
          className="rounded-t-xl object-cover h-44 w-full"
        />
      )}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-semibold text-gray-900">{experience.title}</span>
          <span className="text-xs bg-gray-100 rounded px-2 py-0.5 text-gray-600 ml-auto">
            {experience.location}
          </span>
        </div>
        <p className="text-[13px] text-gray-600 mb-3 min-h-[38px]">
          Curated small-group experience. Certified guide. Safety first with gear included.
        </p>
        <div className="flex items-center justify-between mt-auto">
          <span className="text-gray-500">
            From{' '}
            <span className="font-semibold text-gray-900 text-lg">
              ₹{experience.price}
            </span>
          </span>
          <button
            className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 text-sm font-semibold rounded px-4 py-1 shadow"
            onClick={handleViewDetails}
            type="button"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}
