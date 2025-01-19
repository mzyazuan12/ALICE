import { Models } from "appwrite";
import { Link } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { PostStats } from "@/components/shared";
import { useUserContext } from "@/context/AuthContext";

type Creator = {
  $id: string;
  name: string;
  imageUrl?: string;
};

type Post = Models.Document & {
  imageUrl: string;
  creator: Creator;
};

type GridPostListProps = {
  posts: Post[];
  showUser?: boolean;
  showStats?: boolean;
};

const GridPostItem = ({ post, showUser, showStats }: {
  post: Post;
  showUser: boolean;
  showStats: boolean;
}) => {
  const { user } = useUserContext();
  const [isVideo, setIsVideo] = useState(false);

  useEffect(() => {
    const checkIfVideo = async () => {
      if (!post.imageUrl) return;
      
      try {
        const videoElement = document.createElement("video");
        videoElement.src = post.imageUrl;
        videoElement.preload = "metadata";
        
        await new Promise((resolve) => {
          videoElement.onloadedmetadata = () => {
            setIsVideo(videoElement.duration > 1);
            resolve(null);
          };
          
          videoElement.onerror = () => {
            setIsVideo(false);
            resolve(null);
          };
        });
      } catch (error) {
        console.error("Error checking video:", error);
        setIsVideo(false);
      }
    };

    checkIfVideo();
  }, [post.imageUrl]);

  const MediaContent = useMemo(() => {
    if (!post.imageUrl) {
      return (
        <img
          src="/assets/icons/profile-placeholder.svg"
          alt="placeholder"
          className="h-full w-full object-cover"
        />
      );
    }

    if (isVideo) {
      return (
        <div className="relative w-full h-full">
          <video
            src={post.imageUrl}
            className="h-full w-full object-cover"
            preload="metadata"
            muted
            autoPlay
            loop
          >
            Your browser does not support video playback.
          </video>
          <div className="absolute top-2 right-2 bg-dark-1 p-1.5 rounded-lg bg-opacity-70">
            <img 
              src="/assets/icons/r1.svg" 
              alt="reel"
              width={20}
              height={20}
            />
          </div>
        </div>
      );
    }

    return (
      <img
        src={post.imageUrl}
        alt="post content"
        className="h-full w-full object-cover"
      />
    );
  }, [post.imageUrl, isVideo]);

  const UserInfo = useMemo(() => {
    if (!showUser) return null;

    return (
      <div className="flex items-center justify-start gap-2 flex-1">
        <img
          src={post.creator.imageUrl || "/assets/icons/profile-placeholder.svg"}
          alt={`${post.creator.name}'s profile`}
          className="w-8 h-8 rounded-full"
        />
        <p className="line-clamp-1">{post.creator.name}</p>
      </div>
    );
  }, [post.creator, showUser]);

  return (
    <li key={post.$id} className="relative min-w-80 h-80">
      <Link to={`/posts/${post.$id}`} className="grid-post_link">
        {MediaContent}
      </Link>

      <div className="grid-post_user">
        {UserInfo}
        {showStats && <PostStats post={post} userId={user.id} />}
      </div>
    </li>
  );
};

const GridPostList = ({
  posts,
  showUser = true,
  showStats = true,
}: GridPostListProps) => {
  return (
    <ul className="grid-container">
      {posts.map((post) => (
        <GridPostItem
          key={post.$id}
          post={post}
          showUser={showUser}
          showStats={showStats}
        />
      ))}
    </ul>
  );
};

export default GridPostList;