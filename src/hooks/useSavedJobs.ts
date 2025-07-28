import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface SavedJob {
  id: string;
  job_id: string;
  job_title: string;
  job_company: string;
  job_location: string | null;
  job_url: string | null;
  created_at: string;
}

export const useSavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchSavedJobs = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('saved_jobs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSavedJobs(data || []);
    } catch (error) {
      console.error('Error fetching saved jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const isJobSaved = (jobId: string) => {
    return savedJobs.some(job => job.job_id === jobId);
  };

  const saveJob = async (job: {
    id: string;
    title: string;
    company: string;
    location: string;
    url?: string;
  }) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('saved_jobs')
        .insert({
          user_id: user.id,
          job_id: job.id,
          job_title: job.title,
          job_company: job.company,
          job_location: job.location,
          job_url: job.url || null,
        });

      if (error) throw error;

      await fetchSavedJobs();
      toast({
        title: "Job saved!",
        description: "This job has been added to your saved jobs",
      });
      return true;
    } catch (error: any) {
      if (error.code === '23505') {
        toast({
          title: "Job already saved",
          description: "This job is already in your saved jobs.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error saving job",
          description: "Please try again later.",
          variant: "destructive",
        });
      }
      return false;
    }
  };

  const unsaveJob = async (jobId: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('saved_jobs')
        .delete()
        .eq('user_id', user.id)
        .eq('job_id', jobId);

      if (error) throw error;

      await fetchSavedJobs();
      toast({
        title: "Job removed",
        description: "Job has been removed from your saved jobs.",
      });
      return true;
    } catch (error) {
      toast({
        title: "Error removing job",
        description: "Please try again later.",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchSavedJobs();
  }, [user]);

  return {
    savedJobs,
    loading,
    isJobSaved,
    saveJob,
    unsaveJob,
    fetchSavedJobs
  };
};