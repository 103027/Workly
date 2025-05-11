import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/store/AuthContext';

const DashboardIndex = () => {
  const { userId, role } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
      router.replace(`/dashboard/${role}/${userId}`);
  }, []);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-pro"></div>
        <p className="mt-2 text-gray-600">Loading your dashboard...</p>
      </div>
    </div>
  );
};

export default DashboardIndex;