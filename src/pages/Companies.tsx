import { useState, useEffect, useRef, useCallback } from "react";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const JOBS_API = import.meta.env.VITE_JOBS_API_URL
const PAGE_SIZE = 6;

const Companies = () => {
  const [companies, setCompanies] = useState<Set<string>>(new Set());
  const [visibleCompanies, setVisibleCompanies] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState("");
  const observerRef = useRef(null);
  const navigate = useNavigate();

  const fetchCompanies = useCallback(async (pageNum) => {
    setLoading(true);
    setError("");
    try {
      const url = `${JOBS_API}?page=${pageNum}&limit=${PAGE_SIZE}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch jobs");
      const json = await res.json();
      const jobs = Array.isArray(json.result?.jobs) ? json.result.jobs : [];
      if (jobs.length < PAGE_SIZE) setHasMore(false);
      const newCompanySet = new Set(companies);
      jobs.forEach(job => {
        if (job.owner?.companyName) newCompanySet.add(job.owner.companyName);
      });
      setCompanies(newCompanySet);
      setVisibleCompanies(Array.from(newCompanySet));
    } catch (e) {
      setError("Failed to load companies. Please try again later.");
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [companies]);

  // Initial fetch
  useEffect(() => {
    fetchCompanies(1);
    // eslint-disable-next-line
  }, []);

  // Infinite scroll observer
  useEffect(() => {
    if (loading) return;
    const observer = new window.IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1 }
    );
    if (observerRef.current) observer.observe(observerRef.current);
    return () => {
      if (observerRef.current) observer.unobserve(observerRef.current);
    };
  }, [loading, hasMore]);

  // Fetch on page change
  useEffect(() => {
    if (page > 1) fetchCompanies(page);
    // eslint-disable-next-line
  }, [page]);

  return (
    <div className="container mx-auto px-4 sm:px-6 py-12 min-h-[60vh]">
      <h1 className="text-3xl font-bold mb-8">Companies</h1>
      {error ? (
        <div className="text-center text-destructive py-12">{error}</div>
      ) : visibleCompanies.length === 0 && loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="animate-spin h-10 w-10 text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {visibleCompanies.map((company) => (
            <button
              key={company}
              className="bg-card rounded-lg shadow p-6 flex items-center justify-center text-center text-lg font-semibold text-foreground border border-border hover:bg-muted/40 transition-colors cursor-pointer min-h-[120px]"
              onClick={() => navigate(`/companies/${encodeURIComponent(company)}`)}
              title={`View ${company}`}
            >
              {company}
            </button>
          ))}
        </div>
      )}
      <div ref={observerRef} className="flex justify-center items-center h-20">
        {loading && page > 1 && (
          <Loader2 className="animate-spin h-8 w-8 text-primary" />
        )}
        {!hasMore && (
          <p className="text-muted-foreground">No more companies to load.</p>
        )}
      </div>
    </div>
  );
};

export default Companies; 