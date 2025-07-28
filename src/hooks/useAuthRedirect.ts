import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSavedJobs } from '@/hooks/useSavedJobs';

export const useAuthRedirect = () => {
  const { user } = useAuth();
  const { saveJob } = useSavedJobs();

  useEffect(() => {
    if (user) {
      // Check for pending bookmark action after login
      const pendingBookmark = sessionStorage.getItem('pendingBookmark');
      if (pendingBookmark) {
        try {
          const job = JSON.parse(pendingBookmark);
          sessionStorage.removeItem('pendingBookmark');
          // Delay to ensure auth context is fully loaded
          setTimeout(() => {
            saveJob(job);
          }, 500);
        } catch (error) {
          console.error('Error processing pending bookmark:', error);
          sessionStorage.removeItem('pendingBookmark');
        }
      }
    }
  }, [user, saveJob]);
};