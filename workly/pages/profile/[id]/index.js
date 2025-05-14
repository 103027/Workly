import { useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/store/AuthContext";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, Star } from "lucide-react";

export default function Profile({ profileData }) {
  const router = useRouter();
  const { userId, isAuthenticated } = useAuth();
  
  // Handle case where page is being statically generated or fallback is true
  if (router.isFallback) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-pro"></div>
          <p className="mt-2 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Check if profile data exists
  if (!profileData) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-gray-50 flex items-center justify-center">
        <div className="text-center p-6 max-w-md mx-auto">
          <h1 className="text-2xl font-bold mb-4">Profile Not Found</h1>
          <p className="text-gray-600 mb-6">
            The user profile you're looking for doesn't exist or has been removed.
          </p>
          <Button
            onClick={() => router.push('/dashboard')}
            className="bg-pro hover:bg-pro-light"
          >
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  // Check if the user is viewing their own profile
  const isOwnProfile = isAuthenticated && userId === profileData._id;

  // Authentication check
  if (!isAuthenticated && router.query.id === userId) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-gray-50 flex items-center justify-center">
        <div className="text-center p-6 max-w-md mx-auto">
          <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
          <p className="text-gray-600 mb-6">
            You need to be logged in to view your profile.
          </p>
          <Button
            onClick={() => router.push('/auth/login')}
            className="bg-pro hover:bg-pro-light"
          >
            Log In
          </Button>
        </div>
      </div>
    );
  }

  // Format date to readable format
  const memberSince = new Date(profileData.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Helper function to get initials from name
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-80px)] py-8">
      <div className="container-custom max-w-5xl">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="w-24 h-24 mb-4">
                    <AvatarFallback className="text-xl">{getInitials(profileData.Fullname)}</AvatarFallback>
                  </Avatar>

                  <h1 className="text-2xl font-bold mb-1">{profileData.Fullname}</h1>
                  <p className="text-gray-500 mb-2 capitalize">{profileData.role}</p>

                  {profileData.averageRating > 0 && (
                    <div className="flex items-center mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={i < Math.round(profileData.averageRating) ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}
                        />
                      ))}
                      <span className="ml-2 text-sm">
                        {profileData.averageRating.toFixed(1)} ({profileData.totalRatingsCount} reviews)
                      </span>
                    </div>
                  )}

                  <div className="w-full border-t border-gray-100 my-4 pt-4">
                    <div className="flex flex-col space-y-3 items-start text-left">
                      <div className="flex items-center">
                        <Mail size={16} className="mr-2 text-gray-500" />
                        <span>{profileData.Email}</span>
                      </div>

                      {profileData.phoneNumber && (
                        <div className="flex items-center">
                          <Phone size={16} className="mr-2 text-gray-500" />
                          <span>{profileData.phoneNumber}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="w-full border-t border-gray-100 my-4 pt-4">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold text-pro">{profileData.completedTasks || 0}</p>
                        <p className="text-sm text-gray-500">Tasks Completed</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-pro">{profileData.totalRatingsCount || 0}</p>
                        <p className="text-sm text-gray-500">Reviews</p>
                      </div>
                    </div>
                  </div>

                  <div className="w-full text-sm text-gray-500 mt-2">
                    Member since {memberSince}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2">
            <div className="space-y-4">
              {profileData.ratings && profileData.ratings.length > 0 ? (
                profileData.ratings.map((review, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              className={i < review.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}
                            />
                          ))}
                        </div>
                      </div>

                      <p className="text-gray-700 mb-3">{review.review}</p>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-gray-500">
                      {isOwnProfile
                        ? "You don't have any reviews yet."
                        : "This user doesn't have any reviews yet."}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Static Site Generation
export async function getStaticPaths() {
    try {
      const response = await axios.get('http://localhost:3000/api/profile');
      
      const userIds = response.data.userIds || [];
  
      const paths = userIds.map(id => ({
        params: { id: id.toString() }
      }));
  
      return {
        paths,
        fallback: true
      };
  
    } catch (error) {
      console.error('Error fetching user IDs:', error);
      
      return {
        paths: [],
        fallback: true
      };
    }
  }
  

export async function getStaticProps( context ) {
  try {
    const response = await axios.get(`${process.env.BASE_URL}/api/profile/${context.params.id}`);
    
    return {
      props: {
        profileData: response.data,
      },
      revalidate: 60,
    };
  } catch (error) {
    console.error('Error fetching profile data:', error);
    
    if (error.response && error.response.status === 404) {
      return { notFound: true };
    }
    
    return {
      notFound: true,
      props: { error: 'Failed to load profile' }
    };
  }
}