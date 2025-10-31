'use client';
import { useState, useMemo } from "react";
import ExperienceCard from '../components/ExperienceCard';
import useFetchExperiences from '../hooks/useFetchExperiences';


const HomePage = () => {
  const { experiences, isLoading, error } = useFetchExperiences();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredExperiences = useMemo(() => {
    if (!searchQuery) return experiences;
    return experiences.filter(exp =>
      exp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, experiences]);

  return (
    <div className="min-h-screen bg-[#f6f7fb] px-2 pb-14">
      {isLoading ? (
        <p className="text-center py-8 text-lg">Loading experiences...</p>
      ) : error ? (
        <p className="text-center py-8 text-red-600">Error: {error}</p>
      ) : (
        <section className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 mx-auto">
          {filteredExperiences.length === 0 ? (
            <p>No experiences found.</p>
          ) : (
            filteredExperiences.map(exp => (
              <ExperienceCard key={exp._id} experience={exp} />
            ))
          )}
        </section>
      )}
    </div>
  );
}

export default HomePage