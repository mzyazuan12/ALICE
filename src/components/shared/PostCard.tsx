import { useState, useEffect, useMemo } from "react";
import { Models } from "appwrite";
import { Link } from "react-router-dom";
import { PostStats } from "@/components/shared";
import { multiFormatDateString } from "@/lib/utils";
import { useUserContext } from "@/context/AuthContext";

type Creator = {
  $id: string;
  name: string;
  imageUrl?: string;
};

type PostCardProps = {
  post: Models.Document & {
    mediaType?: "image" | "video";
    imageUrl?: string;
    creator: Creator;
    caption: string;
    tags: string[];
    location: string;
    $createdAt: string;
    $id: string;
  };
};

const PostCard = ({ post }: PostCardProps) => {
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
          className="w-full h-auto rounded-md max-h-[600px] object-contain"
        />
      );
    }

    if (isVideo) {
      return (
        <div className="relative w-full">
          <video
            src={post.imageUrl}
            controls
            autoPlay
            loop
            muted
            className="w-full h-auto rounded-md max-h-[750px] object-contain"
            preload="metadata"
          >
            Your browser does not support video playback.
          </video>
        </div>
      );
    }

    return (
      <img
        src={post.imageUrl}
        alt="post content"
        className="w-full h-auto rounded-md max-h-[600px] object-contain"
      />
    );
  }, [post.imageUrl, isVideo]);

  const ProfileImage = useMemo(() => (
    <img
      src={post.creator?.imageUrl || "/assets/icons/profile-placeholder.svg"}
      alt={`${post.creator.name}'s profile`}
      className="w-12 lg:h-12 rounded-full"
    />
  ), [post.creator?.imageUrl, post.creator.name]);

  return (
    <div className="post-card">
      <div className="flex-between">
        <div className="flex items-center gap-3">
          <Link to={`/profile/${post.creator.$id}`}>
            {ProfileImage}
          </Link>

          <div className="flex flex-col">
            <p className="base-medium lg:body-bold text-light-1">
              {post.creator.name}
            </p>
            <div className="flex-center gap-2 text-light-3">
              <p className="subtle-semibold lg:small-regular">
                {multiFormatDateString(post.$createdAt)}
              </p>
              •
              <p className="subtle-semibold lg:small-regular">
                {post.location}
              </p>
            </div>
          </div>
        </div>

        {user.id === post.creator.$id && (
          <Link to={`/update-post/${post.$id}`}>
            <img
              src="/assets/icons/edit.svg"
              alt="edit post"
              width={20}
              height={20}
            />
          </Link>
        )}
      </div>

      <Link to={`/posts/${post.$id}`}>
        <div className="small-medium lg:base-medium py-5">
          <p>{post.caption}</p>
          {post.tags.length > 0 && (
            <ul className="flex gap-1 mt-2">
              {post.tags.map((tag, index) => (
                <li key={`${tag}-${index}`} className="text-light-3 small-regular">
                  #{tag}
                </li>
              ))}
            </ul>
          )}
        </div>

        {MediaContent}
      </Link>

      <PostStats post={post} userId={user.id} />
    </div>
  );
};

export default PostCard;