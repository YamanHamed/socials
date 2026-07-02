import React, { useCallback, useEffect, useRef, useState } from "react";
import CreatePostCard from "../components/CreatePostCard";
import PostCard from "../components/PostCard";
import { usePosts } from "../contexts/PostContext";
import ErrorTag from "../components/ErrorTag";
import PostSkeleton from "../components/PostSkeleton";

const HomePage = () => {
  // == GENERAL ==
  const {
    posts,
    fetchAllPosts,
    currentPage,
    hasMore,
    isFeedLoading,
    feedError,
    clearFeedError,
  } = usePosts();

  // == FETCHING POSTS ==
  useEffect(() => {
    fetchAllPosts(1);

    return () => {
      clearFeedError();
    };
  }, [fetchAllPosts, clearFeedError]);

  // == INFINITE PAGINATION ==
  const observerInstance = useRef();
  const lastPostElementRef = useCallback(
    (node) => {
      if (isFeedLoading) return;

      if (observerInstance.current) observerInstance.current.disconnect();

      observerInstance.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          console.log(
            `🚀 [INFINITE SCROLL]: Triggering page request: ${currentPage + 1}`,
          );
          fetchAllPosts(currentPage + 1);
        }
      });

      // Point our observer configuration structure down to the raw DOM container node
      if (node) observerInstance.current.observe(node);
    },
    [isFeedLoading, hasMore, currentPage, fetchAllPosts],
  );

  // == SCROLL TO TOP ==
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  useEffect(() => {
    const handleScrollVisibility = () => {
      if (window.scrollY > 500) {
        setShowScrollBtn(true);
      } else {
        setShowScrollBtn(false);
      }
    };

    window.addEventListener("scroll", handleScrollVisibility);
    return () => window.removeEventListener("scroll", handleScrollVisibility);
  }, []);
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div>
      <div className=" max-width-container animate-fade-in ">
        <CreatePostCard className="fancy-top-border" />

        {/* == BACKGROUND STALE REFRESH == */}
        {isFeedLoading && posts.length > 0 && currentPage === 1 && (
          <div
            className="alert bg-light border text-secondary d-flex align-items-center gap-2 py-2 px-3 rounded-3 shadow-sm mb-1 align-self-center w-100"
            style={{ fontSize: "0.85rem", maxWidth: "480px" }}
          >
            <div
              className="spinner-border spinner-border-sm text-primary"
              role="status"
            ></div>
            <span className="fw-semibold text-dark">
              Updating timeline with fresh entries...
            </span>
          </div>
        )}

        {/* == FIRST LOADING == */}
        {isFeedLoading && posts.length === 0 && (
          <div className="d-flex flex-column gap-3 w-100">
            <PostSkeleton />
            <PostSkeleton />
            <PostSkeleton />
          </div>
        )}

        {/* == EMPTY FEED == */}
        {!isFeedLoading && !feedError && posts.length === 0 && (
          <div className="text-center p-5 border border-dashed rounded-3 bg-light m-2">
            <i className="bi bi-chat-left-heart text-muted fs-1 mb-2 d-block"></i>
            <h5 className="fw-semibold text-secondary">
              Your timeline is quiet
            </h5>
            <p className="text-muted small mb-0">
              Nobody has shared anything yet. Be the first and share your
              thoughts!
            </p>
          </div>
        )}

        {/* == FEED ERROR BOX == */}
        {!isFeedLoading && feedError && posts.length === 0 && (
          <ErrorTag
            error={feedError || "Sorry, Something went wrong"}
            onRetry={() => fetchAllPosts(1)}
            type="big"
            severity="info"
          />
        )}

        {/* == FEED DATA == */}
        {posts.map((post) => (
          <PostCard
            likesCount={post.comments_count || post.likes?.length || 0}
            className="mb-4"
            id={post.id}
            autherId={post?.author?.id}
            commentsCount={post.comments_count}
            key={post.id}
            username={post?.author?.username}
            timestamp={post.created_at}
            content={post.body}
            imageUrl={post.image}
            showControls={false}
          />
        ))}

        {/* == PAGINATION LOADING == */}
        {isFeedLoading && posts.length > 0 && currentPage >= 1 && (
          <PostSkeleton />
        )}

        {/* == INFINITE SCROLL ANCHOR == */}
        <div ref={lastPostElementRef} />
      </div>

      {/* == SCROLL TO TOP */}
      <div
        className="position-fixed bottom-0 end-0 m-4 d-flex flex-column gap-2"
        style={{ zIndex: 1030 }}
      >
        {showScrollBtn && (
          <button
            onClick={scrollToTop}
            className="btn-gradient text-white rounded-circle shadow d-flex align-items-center justify-content-center p-0"
            style={{ width: "48px", height: "48px", transition: "all 0.2s" }}
            title="Scroll to Top"
          >
            <i className="bi bi-arrow-up-short fs-4"></i>
          </button>
        )}
      </div>
    </div>
  );
};

export default HomePage;
