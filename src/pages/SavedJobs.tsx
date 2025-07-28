import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bookmark, ExternalLink, MapPin, Calendar } from "lucide-react";
import { useSavedJobs } from "@/hooks/useSavedJobs";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const SavedJobs = () => {
  const { savedJobs, loading, unsaveJob } = useSavedJobs();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading your saved jobs...</div>
      </div>
    );
  }

  const handleUnsaveJob = async (jobId: string) => {
    await unsaveJob(jobId);
  };

  const getCardColor = (index: number) => {
    const colors = [
      "bg-orange-50 border-orange-200",
      "bg-green-50 border-green-200", 
      "bg-purple-50 border-purple-200",
      "bg-blue-50 border-blue-200",
      "bg-pink-50 border-pink-200",
      "bg-yellow-50 border-yellow-200"
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Saved Jobs</h1>
        <p className="text-muted-foreground">
          {savedJobs.length} job{savedJobs.length !== 1 ? 's' : ''} saved
        </p>
      </div>

      {savedJobs.length === 0 ? (
        <div className="text-center py-12">
          <Bookmark className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No saved jobs yet</h3>
          <p className="text-muted-foreground mb-4">
            Start browsing jobs and save the ones you're interested in
          </p>
          <Button onClick={() => navigate("/")}>
            Browse Jobs
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {savedJobs.map((job, index) => (
            <Card key={job.id} className={`${getCardColor(index)} hover:shadow-md transition-shadow`}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{job.job_title}</CardTitle>
                    <p className="text-sm font-medium text-muted-foreground">{job.job_company}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleUnsaveJob(job.job_id)}
                    className="text-orange-600 hover:text-orange-700 hover:bg-orange-100"
                  >
                    <Bookmark className="h-4 w-4 fill-current" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                {job.job_location && (
                  <div className="flex items-center text-sm text-muted-foreground mb-3">
                    <MapPin className="mr-1 h-3 w-3" />
                    {job.job_location}
                  </div>
                )}
                
                <div className="flex items-center text-xs text-muted-foreground mb-4">
                  <Calendar className="mr-1 h-3 w-3" />
                  Saved {new Date(job.created_at).toLocaleDateString()}
                </div>

                <div className="flex gap-2">
                  {job.job_url && (
                    <Button 
                      size="sm" 
                      className="flex-1"
                      onClick={() => window.open(job.job_url!, '_blank')}
                    >
                      <ExternalLink className="mr-1 h-3 w-3" />
                      View Job
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUnsaveJob(job.job_id)}
                    className="text-destructive hover:text-destructive"
                  >
                    Remove
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedJobs;