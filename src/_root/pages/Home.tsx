import React, { useState } from "react";
import { Loader, PostCard, UserCard } from "@/components/shared";
import { useGetRecentPosts, useGetUsers, useGetAiNews } from "@/lib/react-query/queries";
import type { Post } from "@/types/index"; // import your custom `Post` type (extends Models.Document)

const Banner = () => {
  const { data, isLoading, isError } = useGetAiNews();

  return (
    <div className="banner-container overflow-hidden bg-dark-2 p-1.5 sm:p-2 md:p-3 rounded-lg">
      <div className="banner-text-container whitespace-nowrap animate-scroll-left">
        <a
          href="https://devpost.com/hackathons"
          className="text-primary-500 mr-4 sm:mr-6 md:mr-10 inline-block text-[10px] sm:text-tiny-medium md:text-small-medium"
          target="_blank"
          rel="noopener noreferrer"
        >
          New DevPost Hackathons
        </a>

        {isLoading && (
          <span className="text-white mr-4 sm:mr-6 md:mr-10 text-[10px] sm:text-tiny-medium md:text-small-medium">
            Loading...
          </span>
        )}
        {isError && (
          <span className="text-red-500 mr-4 sm:mr-6 md:mr-10 text-[10px] sm:text-tiny-medium md:text-small-medium">
            Error
          </span>
        )}

        {data?.articles.map((article, index) => (
          <a
            key={index}
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-500 mr-4 sm:mr-6 md:mr-10 inline-block text-[10px] sm:text-tiny-medium md:text-small-medium"
          >
            {article.title}
          </a>
        ))}
      </div>
    </div>
  );
};

const Home: React.FC = () => {
  const [showMobileCreators, setShowMobileCreators] = useState(false);

  // This hook should return something like { documents: Post[] }
  const {
    data: posts,
    isLoading: isPostLoading,
    isError: isErrorPosts,
  } = useGetRecentPosts();

  // This hook returns user data
  const {
    data: creators,
    isLoading: isUserLoading,
    isError: isErrorCreators,
  } = useGetUsers(10);

  // Mobile creators panel
  const MobileCreatorsPanel = () => {
    if (!showMobileCreators) return null;

    return (
      <div className="fixed inset-0 z-50 lg:hidden">
        <div
          className="absolute inset-0 bg-black bg-opacity-50"
          onClick={() => setShowMobileCreators(false)}
        />
        <div className="absolute right-0 top-0 bottom-0 w-[280px] bg-dark-2 p-4 overflow-y-auto custom-scrollbar">
          <div className="flex justify-between items-center mb-4">
            <h3 className="h3-bold text-light-1">Popular Creators</h3>
            <button onClick={() => setShowMobileCreators(false)}>
              <img src="/assets/icons/back.svg" alt="Close" className="w-6 h-6" />
            </button>
          </div>
          {isUserLoading && !creators ? (
            <Loader />
          ) : (
            <ul className="flex flex-col gap-4">
              {creators?.documents.map((creator) => (
                <li key={creator.$id}>
                  <UserCard user={creator} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
  };

  // Error states
  if (isErrorPosts || isErrorCreators) {
    return (
      <div className="flex flex-1">
        <div className="home-container">
          <p className="body-medium text-light-1">Something bad happened</p>
        </div>
        <div className="home-creators hidden lg:block">
          <p className="body-medium text-light-1">Something bad happened</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 h-screen">
      {/* Background Video */}
      <div className="fixed inset-0 -z-10">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-20"
        >
          <source src="/assets/images/pop.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Main Content Container */}
      <div className="flex w-full h-full">
        {/* Posts Section */}
        <div className="flex-1 h-full overflow-y-auto custom-scrollbar">
          <div className="w-full max-w-[280px] xs:max-w-[380px] sm:max-w-[480px] md:max-w-[580px] lg:max-w-[680px] mx-auto px-2 xs:px-3 sm:px-4 py-4 sm:py-6 md:py-10">
            {/* Banner */}
            <Banner />

            {/* Posts */}
            <h2 className="text-[16px] xs:text-[18px] sm:h3-bold md:h2-bold text-left w-full mt-4 sm:mt-6">
              For you
            </h2>

            {isPostLoading && !posts ? (
              <Loader />
            ) : (
              <ul className="flex flex-col gap-4 sm:gap-6 md:gap-8 w-full mt-4 sm:mt-6">
                {posts?.documents.map((post: Post) => (
                  <li key={post.$id} className="w-full">
                    <PostCard post={post} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Popular Creators Section - Hidden on mobile, visible on lg */}
        <div className="hidden lg:block w-[340px] xl:w-[400px] h-full overflow-y-auto custom-scrollbar bg-dark-2 border-l border-dark-4">
          <div className="px-4 py-10">
            <h3 className="h3-bold text-light-1">Popular Creators</h3>

            {isUserLoading && !creators ? (
              <Loader />
            ) : (
              <ul className="flex flex-col gap-6 mt-6">
                {creators?.documents.map((creator) => (
                  <li key={creator.$id}>
                    <UserCard user={creator} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Mobile Popular Creators Button */}
        <button
          className="fixed bottom-4 right-4 lg:hidden bg-dark-2 p-3 rounded-full shadow-lg"
          onClick={() => setShowMobileCreators(true)}
        >
          <img
            src="/assets/icons/people.svg"
            alt="View Creators"
            className="w-5 h-5"
          />
        </button>

        {/* Mobile Creators Panel */}
        <MobileCreatorsPanel />
      </div>
    </div>
  );
};

export default Home;
