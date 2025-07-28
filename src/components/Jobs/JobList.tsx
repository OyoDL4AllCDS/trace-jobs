import { useState, useEffect, useRef, useCallback } from "react";
import { ArrowUpDown, Grid, List, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import JobCard from "./JobCard";

const JOBS_API = import.meta.env.VITE_JOBS_API_URL
const LOCAL_NIGERIA_JOBS_API = "/api/nigeria-jobs";
const PAGE_SIZE = 6;

function formatDateWithOrdinal(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'long' });
  const year = date.getFullYear();
  // Ordinal suffix
  const j = day % 10, k = day % 100;
  let suffix = 'th';
  if (j === 1 && k !== 11) suffix = 'st';
  else if (j === 2 && k !== 12) suffix = 'nd';
  else if (j === 3 && k !== 13) suffix = 'rd';
  return `${day}${suffix} ${month} ${year}`;
}

function mapApiJobToJobCard(apiJob) {
  let workArrangement = 'Hybrid';
  if (apiJob.type) {
    if (typeof apiJob.type === 'string') {
      if (apiJob.type.toLowerCase().includes('remote')) workArrangement = 'Remote';
      else if (apiJob.type.toLowerCase().includes('onsite')) workArrangement = 'Onsite';
      else if (apiJob.type.toLowerCase().includes('hybrid')) workArrangement = 'Hybrid';
    }
  }
  let type = 'Full-time';
  if (apiJob.type) {
    const t = apiJob.type.toLowerCase();
    if (t.includes('part')) type = 'Part-time';
    else if (t.includes('contract')) type = 'Contract';
    else if (t.includes('intern')) type = 'Internship';
    else type = 'Full-time';
  }
  const literacyLevel = 'Intermediate';
  return {
    id: String(apiJob._id),
    title: apiJob.title,
    company: apiJob.owner?.companyName || "Unknown Company",
    location: apiJob.locationAddress || apiJob.owner?.locationAddress || "Remote",
    type,
    workArrangement,
    literacyLevel,
    salary: apiJob.descriptionBreakdown?.salaryRangeMinYearly && apiJob.descriptionBreakdown?.salaryRangeMaxYearly
      ? `${apiJob.descriptionBreakdown.salaryRangeMinYearly} - ${apiJob.descriptionBreakdown.salaryRangeMaxYearly}`
      : undefined,
    postedTime: apiJob.createdAt ? formatDateWithOrdinal(apiJob.createdAt) : "",
    description: apiJob.descriptionBreakdown?.oneSentenceJobSummary || apiJob.description || "",
    tags: apiJob.descriptionBreakdown?.keywords || apiJob.skills_suggest || [],
    applicants: undefined,
    url: apiJob.url,
  };
}

const JobList = ({ keyword = "", location = "", selectedFilters = [] }) => {
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("grid");
  const [showNigeriaOnly, setShowNigeriaOnly] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [allJobs, setAllJobs] = useState([]); // for filtering
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState("");
  const observerRef = useRef(null);

  const fetchJobs = useCallback(async (pageNum) => {
    setLoading(true);
    setError("");
    try {
      let newJobs = [];
      if (showNigeriaOnly) {
        // Fetch from local scraper
        const res = await fetch(LOCAL_NIGERIA_JOBS_API);
        if (!res.ok) throw new Error("Failed to fetch Nigeria jobs");
        const json = await res.json();
        newJobs = Array.isArray(json.jobs) ? json.jobs : [];
        // Map scraped jobs to JobCard format
        newJobs = newJobs.map((job, idx) => ({
          id: job.url || `nigeria-job-${idx}`,
          title: job.title || "Job Opportunity",
          company: job.company !== "N/A" ? job.company : "Nigerian Company",
          location: job.location || "Nigeria",
          type: "Full-time",
          workArrangement: "Onsite",
          literacyLevel: "Intermediate",
          salary: undefined,
          postedTime: job.posted || "Recently",
          description: job.title || "Exciting job opportunity in Nigeria",
          tags: ["Nigeria", "Local"],
          applicants: undefined,
          url: job.url,
        }));
        setAllJobs(newJobs);
        setHasMore(false); // Only one page for now
      } else {
        const url = `${JOBS_API}?page=${pageNum}&limit=${PAGE_SIZE}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch jobs");
        const json = await res.json();
        newJobs = Array.isArray(json.result?.jobs) ? json.result.jobs : [];
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setAllJobs((prev) => [...prev, ...newJobs.map(mapApiJobToJobCard)]);
        if (newJobs.length < PAGE_SIZE) setHasMore(false);
      }
    } catch (e) {
      setError("Failed to load jobs. Please try again later.");
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [showNigeriaOnly]);

  // Reset jobs when filter/search changes
  useEffect(() => {
    setAllJobs([]);
    setJobs([]);
    setPage(1);
    setHasMore(true);
  }, [showNigeriaOnly, sortBy, keyword, location]);

  // Fetch jobs on page or filter change
  useEffect(() => {
    if (hasMore) fetchJobs(page);
    // eslint-disable-next-line
  }, [page, showNigeriaOnly, sortBy, keyword, location]);

  // Filter jobs client-side
  useEffect(() => {
    let filtered = allJobs;
    if (keyword) {
      const kw = keyword.toLowerCase();
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(kw) ||
          job.description.toLowerCase().includes(kw) ||
          job.company.toLowerCase().includes(kw) ||
          (Array.isArray(job.tags) && job.tags.some((tag) => tag.toLowerCase().includes(kw)))
      );
    }
    if (location) {
      const loc = location.toLowerCase();
      filtered = filtered.filter((job) => job.location.toLowerCase().includes(loc));
    }
    if (selectedFilters.length > 0) {
      filtered = filtered.filter((job) => {
        // Work Arrangement
        const workArr = selectedFilters.some(f => ["Remote", "Hybrid", "Onsite"].includes(f))
          ? selectedFilters.includes(job.workArrangement)
          : true;
        // Job Type
        const jobType = selectedFilters.some(f => ["Full-time", "Part-time", "Contract", "Internship"].includes(f))
          ? selectedFilters.includes(job.type)
          : true;
        // Skill Level
        const skill = selectedFilters.some(f => ["Basic", "Intermediate", "Advanced"].includes(f))
          ? selectedFilters.includes(job.literacyLevel)
          : true;
        return workArr && jobType && skill;
      });
    }
    setJobs(filtered);
  }, [allJobs, keyword, location, selectedFilters]);

  // IntersectionObserver for infinite scroll
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

  return (
    <div className="space-y-6">
      {/* Header with Sort and View Options */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">
            {jobs.length === 0 && loading ? "Loading..." : jobs.length.toLocaleString() + " Jobs Found"}
          </h2>
          <p className="text-muted-foreground">
            Find your perfect opportunity {showNigeriaOnly ? "in Nigeria" : "worldwide"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Nigeria Only Toggle */}
          <Button
            variant={showNigeriaOnly ? "default" : "outline"}
            onClick={() => setShowNigeriaOnly((v) => !v)}
          >
            {showNigeriaOnly ? "Showing Nigeria Only" : "Show Nigeria Only"}
          </Button>
          {/* Sort Options */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">
                <div className="flex items-center">
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  Newest First
                </div>
              </SelectItem>
              <SelectItem value="salary-high">Salary: High to Low</SelectItem>
              <SelectItem value="salary-low">Salary: Low to High</SelectItem>
              <SelectItem value="relevance">Most Relevant</SelectItem>
            </SelectContent>
          </Select>
          {/* View Mode Toggle */}
          <div className="flex border rounded-lg">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="rounded-r-none"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Nigerian Jobs "Coming Soon" Message */}
      {showNigeriaOnly ? (
        <div className="text-center py-20">
          <h3 className="text-2xl font-bold">Coming Soon!</h3>
          <p className="text-muted-foreground mt-2">
            Our team is working hard to bring you Nigerian jobs.
            <br />
            Check back later, you might get lucky!
          </p>
        </div>
      ) : (
        <>
          {/* Job Grid */}
          {error ? (
            <div className="text-center py-12 text-destructive">{error}</div>
          ) : (
            <div
              className={`grid gap-6 ${
                viewMode === "grid"
                  ? "grid-cols-1 lg:grid-cols-2"
                  : "grid-cols-1"
              }`}
            >
              {jobs.map((job, index) => (
                <JobCard key={job.id} job={job} index={index} />
              ))}
            </div>
          )}
          {/* Infinite Scroll Trigger & Loading */}
          <div
            ref={observerRef}
            className="flex justify-center items-center min-h-[48px]"
          >
            {loading && (
              <Loader2 className="animate-spin h-6 w-6 text-muted-foreground" />
            )}
            {!hasMore && !loading && jobs.length > 0 && (
              <span className="text-muted-foreground">No more data</span>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default JobList;