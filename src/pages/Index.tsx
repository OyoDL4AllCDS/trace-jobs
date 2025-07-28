import Hero from "@/components/Layout/Hero";
import JobFilters from "@/components/Jobs/JobFilters";
import JobList from "@/components/Jobs/JobList";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { useState } from "react";

const Index = () => {
  useAuthRedirect();
  const [search, setSearch] = useState({ keyword: "", location: "" });
  const [selectedFilters, setSelectedFilters] = useState([]);

  const handleSearch = (keyword, location) => {
    setSearch({ keyword, location });
  };

  return (
    <div className="min-h-screen bg-background">
      <Hero onSearch={handleSearch} />

      <main className="container mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">

          <aside className="lg:w-80 lg:flex-shrink-0">
            <JobFilters selectedFilters={selectedFilters} onChange={setSelectedFilters} />
          </aside>

          <div className="flex-1 min-w-0">
            <JobList keyword={search.keyword} location={search.location} selectedFilters={selectedFilters} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
