import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui";
import { Loader } from "@/components/shared";
import { GridPostList, PostStats } from "@/components/shared";
import { 
  useGetPostById, 
  useGetUserPosts, 
  useDeletePost, 
  useIncrementViewCount 
} from "@/lib/react-query/queries";
import { multiFormatDateString } from "@/lib/utils";
import { useUserContext } from "@/context/AuthContext";
import { useEffect, useState, useMemo } from "react";

const PostDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useUserContext();
  const [isVideo, setIsVideo] = useState(false);

  const { data: post, isLoading } = useGetPostById(id);
  const { mutate: incrementViewCount } = useIncrementViewCount();
  const { mutate: deletePost } = useDeletePost();
  const { data: userPosts, isLoading: isUserPostLoading } = useGetUserPosts(post?.creator.$id);

  const relatedPosts = useMemo(() => {
    return userPosts?.documents.filter((userPost) => userPost.$id !== id);
  }, [userPosts?.documents, id]);

  useEffect(() => {
    if (post?.$id) {
      incrementViewCount(post.$id);
    }
  }, [post?.$id, incrementViewCount]);

  useEffect(() => {
    const checkIfVideo = async () => {
      if (!post?.imageUrl) return;
      
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
  }, [post?.imageUrl]);

  const handleDeletePost = () => {
    if (!post?.$id || !post?.imageId) return;
    deletePost({ postId: post.$id, imageId: post.imageId });
    navigate(-1);
  };

  const MediaContent = useMemo(() => {
    if (!post?.imageUrl) return null;

    if (isVideo) {
      return (
        <div className="relative w-full">
          <video
            src={post.imageUrl}
            controls
            className="w-full h-auto rounded-md max-h-[600px] object-contain"
            preload="metadata"
            loop
            autoPlay
            muted
          >
            Your browser does not support video playback.
          </video>
        </div>
      );
    }

    return (
      <img
        src={post.imageUrl}
        alt="post media"
        className="post_details-img"
      />
    );
  }, [post?.imageUrl, isVideo]);

  const CreatorProfile = useMemo(() => (
    <Link to={`/profile/${post?.creator.$id}`} className="flex items-center gap-3">
      <img
        src={post?.creator.imageUrl || "/assets/icons/profile-placeholder.svg"}
        alt={`${post?.creator.name}'s profile`}
        className="w-8 h-8 lg:w-12 lg:h-12 rounded-full"
      />
      <div className="flex gap-1 flex-col">
        <p className="base-medium lg:body-bold text-light-1">
          {post?.creator.name}
        </p>
        <div className="flex-center gap-2 text-light-3">
          <p className="subtle-semibold lg:small-regular">
            {multiFormatDateString(post?.$createdAt)}
          </p>
          •
          <p className="subtle-semibold lg:small-regular">
            {post?.location}
          </p>
        </div>
      </div>
    </Link>
  ), [post?.creator]);

  return (
    <div className="post_details-container">
      <div className="hidden md:flex max-w-5xl w-full">
        <Button
          onClick={() => navigate(-1)}
          variant="ghost"
          className="shad-button_ghost"
        >
          <img
            src="/assets/icons/back.svg"
            alt="back"
            width={24}
            height={24}
          />
          <p className="small-medium lg:base-medium">Back</p>
        </Button>
      </div>

      {isLoading || !post ? (
        <Loader />
      ) : (
        <div className="post_details-card">
          {MediaContent}

          <div className="post_details-info">
            <div className="flex-between w-full">
              {CreatorProfile}

              <div className="flex-center gap-4">
                {user.id === post.creator.$id && (
                  <>
                    <Link to={`/update-post/${post.$id}`}>
                      <img
                        src="/assets/icons/edit.svg"
                        alt="edit post"
                        width={24}
                        height={24}
                      />
                    </Link>

                    <Button
                      onClick={handleDeletePost}
                      variant="ghost"
                      className="post_details-delete_btn"
                    >
                      <img
                        src="/assets/icons/delete.svg"
                        alt="delete post"
                        width={24}
                        height={24}
                      />
                    </Button>
                  </>
                )}
              </div>
            </div>

            <hr className="border w-full border-dark-4/80" />

            <div className="flex flex-col flex-1 w-full small-medium lg:base-regular">
              <p>{post.caption}</p>
              {post.tags.length > 0 && (
                <ul className="flex gap-1 mt-2">
                  {post.tags.map((tag: string, index: number) => (
                    <li key={`${tag}-${index}`} className="text-light-3 small-regular">
                      #{tag}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="w-full">
              <PostStats post={post} userId={user.id} />
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-5xl">
        <hr className="border w-full border-dark-4/80" />

        <h3 className="body-bold md:h3-bold w-full my-10">
          More Related Posts
        </h3>
        {isUserPostLoading || !relatedPosts ? (
          <Loader />
        ) : (
          <GridPostList posts={relatedPosts} />
        )}
      </div>
    </div>
  );
};

export default PostDetails;