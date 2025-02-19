import { useState, useMemo } from "react";
import { Loader, PostCard, UserCard } from "@/components/shared";
import { useGetRecentPosts, useGetUsers } from "@/lib/react-query/queries";
import { Post } from "@/types";

const Home = () => {
  const [showMobileCreators, setShowMobileCreators] = useState(false);

  const { 
    data: postsData,
    isLoading: isPostLoading,
    isError: isErrorPosts,
  } = useGetRecentPosts();

  const {
    data: creatorsData,
    isLoading: isUserLoading,
    isError: isErrorCreators,
  } = useGetUsers(10);

  // Transform postsData.documents (of type Document[]) to Post[]
  const recentPosts: Post[] = useMemo(() => {
    return postsData?.documents.map((doc: any) => ({
      ...doc,
      // These properties are expected by PostCard. Adjust defaults as needed.
      mediaType: doc.mediaType || "image",
      imageUrl: doc.imageUrl || "",
      creator: doc.creator || {
        $id: "",
        name: "",
        imageUrl: "/assets/icons/profile-placeholder.svg",
      },
      caption: doc.caption || "",
      tags: doc.tags || [],
      location: doc.location || "",
    })) || [];
  }, [postsData?.documents]);

  // Mobile creators panel component
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
            <button 
              onClick={() => setShowMobileCreators(false)}
              aria-label="Close creators panel"
            >
              <img src="/assets/icons/back.svg" alt="Close" className="w-6 h-6" />
            </button>
          </div>
          {isUserLoading && !creatorsData ? (
            <Loader />
          ) : (
            <ul className="flex flex-col gap-4">
              {creatorsData?.documents.map((creator: any) => (
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

  if (isErrorPosts || isErrorCreators) {
    return (
      <div className="flex flex-1">
        <div className="home-container">
          <p className="body-medium text-light-1">Error loading content</p>
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
            {/* Posts Header */}
            <h2 className="text-[16px] xs:text-[18px] sm:h3-bold md:h2-bold text-left w-full mt-4 sm:mt-6">
              For you
            </h2>

            {isPostLoading && !postsData ? (
              <Loader />
            ) : (
              <ul className="flex flex-col gap-4 sm:gap-6 md:gap-8 w-full mt-4 sm:mt-6">
                {recentPosts.map((post: Post) => (
                  <li key={post.$id} className="w-full">
                    <PostCard post={post} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Popular Creators Section - Desktop */}
        <div className="hidden lg:block w-[340px] xl:w-[400px] h-full overflow-y-auto custom-scrollbar bg-dark-2 border-l border-dark-4">
          <div className="px-4 py-10">
            <h3 className="h3-bold text-light-1">Popular Creators</h3>
            {isUserLoading && !creatorsData ? (
              <Loader />
            ) : (
              <ul className="flex flex-col gap-6 mt-6">
                {creatorsData?.documents.map((creator: any) => (
                  <li key={creator.$id}>
                    <UserCard user={creator} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Mobile Creators Toggle */}
        <button
          className="fixed bottom-4 right-4 lg:hidden bg-dark-2 p-3 rounded-full shadow-lg hover:bg-dark-3 transition-colors"
          onClick={() => setShowMobileCreators(true)}
          aria-label="Show creators"
        >
          <img
            src="/assets/icons/people.svg"
            alt="View Creators"
            className="w-5 h-5"
          />
        </button>

        <MobileCreatorsPanel />
      </div>
    </div>
  );
};

export default Home;
