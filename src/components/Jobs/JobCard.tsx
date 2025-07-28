import { MapPin, Clock, DollarSign, Building, BookOpen, Users, Bookmark } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useSavedJobs } from "@/hooks/useSavedJobs";
import { useNavigate } from "react-router-dom";

interface JobCardProps {
  job: {
    id: string;
    title: string;
    company: string;
    location: string;
    type: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
    workArrangement: 'Remote' | 'Hybrid' | 'Onsite';
    literacyLevel: 'Basic' | 'Intermediate' | 'Advanced';
    salary?: string;
    postedTime: string;
    description: string;
    tags: string[];
    applicants?: number;
    url?: string;
  };
  index?: number;
}

const JobCard = ({ job, index = 0 }: JobCardProps) => {
  const { user } = useAuth();
  const { isJobSaved, saveJob, unsaveJob } = useSavedJobs();
  const navigate = useNavigate();

  const getCardColor = (index: number) => {
    const colors = [
      "bg-orange-50 border-orange-200 hover:bg-orange-100",
      "bg-green-50 border-green-200 hover:bg-green-100", 
      "bg-purple-50 border-purple-200 hover:bg-purple-100",
      "bg-blue-50 border-blue-200 hover:bg-blue-100",
      "bg-pink-50 border-pink-200 hover:bg-pink-100",
      "bg-yellow-50 border-yellow-200 hover:bg-yellow-100"
    ];
    return colors[index % colors.length];
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      sessionStorage.setItem('pendingBookmark', JSON.stringify(job));
      navigate('/auth');
      return;
    }

    const saved = isJobSaved(job.id);
    if (saved) {
      unsaveJob(job.id);
    } else {
      saveJob(job);
    }
  };

  const getLiteracyBadgeVariant = (level: string) => {
    switch (level) {
      case 'Basic': return 'default';
      case 'Intermediate': return 'secondary';
      case 'Advanced': return 'outline';
      default: return 'default';
    }
  };

  const getWorkArrangementColor = (arrangement: string) => {
    switch (arrangement) {
      case 'Remote': return 'bg-primary/10 text-primary border-primary/20';
      case 'Hybrid': return 'bg-accent/10 text-accent border-accent/20';
      case 'Onsite': return 'bg-muted/60 text-muted-foreground border-border';
      default: return 'bg-muted/60 text-muted-foreground border-border';
    }
  };

  const cardContent = (
    <Card className={`group ${getCardColor(index)} hover:shadow-card transition-all duration-300 hover:scale-[1.02] cursor-pointer h-80`}>
      <CardContent className="p-6 h-full flex flex-col">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors line-clamp-2">
              {job.title}
            </h3>
            <div className="flex items-center text-muted-foreground mt-1">
              <Building className="h-4 w-4 mr-1" />
              <span className="text-sm">{job.company}</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBookmark}
              className="h-8 w-8 p-0 hover:bg-primary/10"
            >
              <Bookmark 
                className={`h-4 w-4 transition-colors ${
                  user && isJobSaved(job.id) 
                    ? 'fill-primary text-primary' 
                    : 'text-muted-foreground hover:text-primary'
                }`} 
              />
            </Button>
            <Badge 
              className={`${getWorkArrangementColor(job.workArrangement)} font-medium`}
            >
              {job.workArrangement}
            </Badge>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-muted-foreground">
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{job.location}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            <span>{job.type}</span>
          </div>
          {job.salary && (
            <div className="flex items-center">
              <DollarSign className="h-4 w-4 mr-1" />
              <span className="font-medium">{job.salary}</span>
            </div>
          )}
        </div>

        <p className="text-sm text-muted-foreground mb-4 line-clamp-3 flex-grow">
          {job.description}
        </p>

        {/* Tags & Literacy Level */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant={getLiteracyBadgeVariant(job.literacyLevel)} className="text-xs">
            <BookOpen className="h-3 w-3 mr-1" />
            {job.literacyLevel} Level
          </Badge>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border/50 mt-auto">
          <div className="flex items-center text-xs text-muted-foreground">
            <Clock className="h-3 w-3 mr-1" />
            <span>{job.postedTime}</span>
            {job.applicants && (
              <>
                <span className="mx-2">•</span>
                <Users className="h-3 w-3 mr-1" />
                <span>{job.applicants} applied</span>
              </>
            )}
          </div>
          <Button
            variant="hero"
            size="sm"
            asChild
          >
            {job.url ? (
              <a
                href={job.url}
                target="_blank"
                rel="noopener noreferrer"
                tabIndex={-1}
                onClick={e => e.stopPropagation()}
              >
                Apply Now
              </a>
            ) : (
              <>Apply Now</>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return job.url ? (
    <a
      href={job.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block focus:outline-none focus:ring-2 focus:ring-primary"
      tabIndex={0}
    >
      {cardContent}
    </a>
  ) : (
    cardContent
  );
};

export default JobCard;