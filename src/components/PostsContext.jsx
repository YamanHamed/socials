import {
  useRef,
  useCallback,
  useState,
  useEffect,
  useContext,
  createContext,
} from "react";
import { getPosts } from "./Auth";
import { logContext } from "../components/AuthContext";

const PostsContext = createContext();

export function PostsProvider({ children }) {
  // eslint-disable-next-line
  const [loggedIn] = useContext(logContext);
  const [postsState, setPostsState] = useState({
    items: [], // the posts
    page: 1, // current page
    hasMore: true, // more posts available?
    loading: false, // loading status
    error: null, // error message if any
  });
  const observerRef = useRef();
  const lastPostRef = useRef();

  //#region <-- functions -->

  // fetchPosts()
  const fetchPosts = useCallback(
    async (pageNum) => {
      if (postsState.loading) return;

      setPostsState((prev) => ({ ...prev, loading: true }));

      const response = await getPosts(pageNum);

      if (response.success) {
        const newPosts = response.data.data;
        const totalPages = response.data.meta.last_page;

        setPostsState((prev) => ({
          items: pageNum === 1 ? newPosts : [...prev.items, ...newPosts],
          page: pageNum,
          hasMore: pageNum < totalPages,
          loading: false,
          error: null,
        }));
      } else {
        setPostsState((prev) => ({
          ...prev,
          error: response.error,
          hasMore: false,
          loading: false,
        }));
        console.log(response.error);
      }
    },
    [postsState.loading],
  );

  // setupObserver()
  const setupObserver = useCallback(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver((entries) => {
      if (
        entries[0].isIntersecting &&
        postsState.hasMore &&
        !postsState.loading
      ) {
        setPostsState((prev) => ({ ...prev, page: prev.page + 1 }));
      }
    });

    if (lastPostRef.current) {
      observerRef.current.observe(lastPostRef.current);
    }
  }, [postsState.hasMore, postsState.loading]);

  // resetPosts()
  const resetPosts = useCallback(() => {
    setPostsState({
      items: [],
      page: 1,
      hasMore: true,
      loading: false,
      error: null,
    });
  }, []);

  //#endregion

  // Fetch when page changes
  useEffect(() => {
    fetchPosts(postsState.page);
  }, [postsState.page]); // Removed fetchPosts from deps

  // Setup observer when needed
  useEffect(() => {
    setupObserver();
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [setupObserver, postsState.items]);

  const passedvalue = {
    // Data
    posts: postsState.items,
    loading: postsState.loading,
    error: postsState.error,
    hasMore: postsState.hasMore,
    page: postsState.page,
    // Refs
    lastPostRef,
    // Actions
    fetchPosts,
    resetPosts,
    setupObserver,
  };
  return (
    <PostsContext.Provider value={passedvalue}>
      {children}
    </PostsContext.Provider>
  );
}

export function usePosts() {
  const context = useContext(PostsContext);
  if (!context) {
    throw new Error("usePosts must be used within a PostsProvider");
  }
  return context;
}
