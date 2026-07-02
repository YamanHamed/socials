import React, {
  createContext,
  useCallback,
  useContext,
  useReducer,
} from "react";
import * as api from "../api/reqs";
import { useProfile } from "./ProfileContext";

const PostContext = createContext(null);
export const usePosts = () => useContext(PostContext);

const initialState = {
  // feed page
  posts: [],
  currentPage: 1,
  hasMore: true,
  isFeedLoading: false,
  feedError: null,
  lastFetched: null,
  // post details page
  currentPost: null,
  isSinglePostLoading: false,
  singlePostError: null,
  // actions ( delete, edit, create )
  isActionLoading: false,
  mutationError: null,
};

const postReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_FEED_START":
      return { ...state, isFeedLoading: true, feedError: null };
    case "FETCH_FEED_FAIL":
      return { ...state, isFeedLoading: false, feedError: action.payload };
    case "FETCH_FEED_SUCCESS": {
      const { posts: incomingPosts, page, meta, limit } = action.payload;
      const uniquePosts =
        page === 1
          ? incomingPosts
          : [
              ...state.posts,
              ...incomingPosts.filter(
                (p) => !state.posts.some((ep) => ep.id === p.id),
              ),
            ];
      return {
        ...state,
        isFeedLoading: false,
        posts: uniquePosts,
        currentPage: page,
        hasMore: meta?.last_page
          ? page < meta.last_page
          : incomingPosts.length >= (limit || 10),
        lastFetched: page === 1 ? Date.now() : state.lastFetched,
      };
    }

    case "MUTATION_START":
      return { ...state, isActionLoading: true, mutationError: null };
    case "MUTATION_FAIL":
      return {
        ...state,
        isActionLoading: false,
        mutationError: action.payload,
      };
    case "CREATE_POST_SUCCESS":
      return {
        ...state,
        isActionLoading: false,
        posts: [action.payload, ...state.posts],
      };
    case "EDIT_POST_SUCCESS":
      return {
        ...state,
        isActionLoading: false,
        posts: state.posts.map((p) =>
          p.id === action.payload.id ? action.payload : p,
        ),
        currentPost:
          state.currentPost?.id === action.payload.id
            ? action.payload
            : state.currentPost,
      };
    case "DELETE_POST_SUCCESS":
      return {
        ...state,
        isActionLoading: false,
        posts: state.posts.filter((p) => p.id !== action.payload),
      };
    case "ADD_COMMENT_SUCCESS": {
      if (!state.currentPost) return state;
      return {
        ...state,
        isActionLoading: false,
        currentPost: {
          ...state.currentPost,
          comments: [...(state.currentPost.comments || []), action.payload],
          comments_count: (state.currentPost.comments_count || 0) + 1,
        },
      };
    }

    case "FETCH_POST_START":
      return { ...state, isSinglePostLoading: true, singlePostError: null };
    case "FETCH_POST_FAIL":
      return {
        ...state,
        isSinglePostLoading: false,
        singlePostError: action.payload,
      };
    case "FETCH_POST_SUCCESS":
      return {
        ...state,
        isSinglePostLoading: false,
        currentPost: action.payload,
      };

    case "CLEAR_MUTATION_ERROR":
      return { ...state, mutationError: null };
    case "CLEAR_FEED_ERROR":
      return { ...state, feedError: null };
    case "CLEAR_SINGLE_POST":
      return { ...state, currentPost: null };

    default:
      return state;
  }
};

export const PostProvider = ({ children }) => {
  const [state, dispatch] = useReducer(postReducer, initialState);
  const { syncCreate, syncEdit, syncDelete } = useProfile();

  const fetchAllPosts = useCallback(
    async (page = 1, limit = 10, forceRefresh = false) => {
      const CACHE_WINDOW = 2 * 60 * 1000;
      if (
        page === 1 &&
        state.posts.length > 0 &&
        state.lastFetched &&
        Date.now() - state.lastFetched < CACHE_WINDOW &&
        !forceRefresh
      ) {
        return;
      }
      dispatch({ type: "FETCH_FEED_START" });
      const result = await api.getPosts(page, limit);
      if (result.success) {
        dispatch({
          type: "FETCH_FEED_SUCCESS",
          payload: {
            posts: result.data?.data || result.data,
            page,
            meta: result.data?.meta,
            limit,
          },
        });
      } else {
        dispatch({ type: "FETCH_FEED_FAIL", payload: result.error });
      }
    },
    [state.lastFetched, state.posts.length],
  );

  const createNewPost = async (title, body, imageFile) => {
    dispatch({ type: "MUTATION_START" });
    const result = await api.addPost("", body, imageFile);
    if (result.success) {
      const createdPost = result.data?.data || result.data;
      dispatch({ type: "CREATE_POST_SUCCESS", payload: createdPost });
      syncCreate(createdPost);
      return { success: true };
    } else {
      dispatch({ type: "MUTATION_FAIL", payload: result.error });
      return { success: false, error: result.error };
    }
  };

  const updateExistingPost = async (postId, title, body, imageParam) => {
    dispatch({ type: "MUTATION_START" });
    const result = await api.editPost(postId, "", body, imageParam);
    if (result.success) {
      const updatedPost = result.data?.data || result.data;
      dispatch({ type: "EDIT_POST_SUCCESS", payload: updatedPost });
      syncEdit(updatedPost);
      return { success: true };
    } else {
      dispatch({ type: "MUTATION_FAIL", payload: result.error });
      return { success: false, error: result.error };
    }
  };

  const deleteExistingPost = async (postId) => {
    dispatch({ type: "MUTATION_START" });
    const result = await api.deletePost(postId);
    if (result.success) {
      dispatch({ type: "DELETE_POST_SUCCESS", payload: postId });
      syncDelete(postId);
      return { success: true };
    } else {
      dispatch({ type: "MUTATION_FAIL", payload: result.error });
      return { success: false, error: result.error };
    }
  };

  const fetchPostById = useCallback(async (postId) => {
    dispatch({ type: "FETCH_POST_START" });
    const result = await api.getPostDetails(postId);
    if (result.success) {
      dispatch({
        type: "FETCH_POST_SUCCESS",
        payload: result.data?.data || result.data,
      });
    } else {
      dispatch({ type: "FETCH_POST_FAIL", payload: result.error });
    }
  }, []);

  const addCommentToPost = async (postId, body) => {
    dispatch({ type: "MUTATION_START" });
    const result = await api.addComment(postId, body);
    if (result.success) {
      const newComment = result.data?.data || result.data;
      dispatch({ type: "ADD_COMMENT_SUCCESS", payload: newComment });
      return { success: true, data: newComment };
    } else {
      dispatch({ type: "MUTATION_FAIL", payload: result.error });
      return { success: false, error: result.error };
    }
  };

  const clearMutationError = useCallback(
    async () => dispatch({ type: "CLEAR_MUTATION_ERROR" }),
    [],
  );
  const clearFeedError = useCallback(
    async () => dispatch({ type: "CLEAR_FEED_ERROR" }),
    [],
  );
  const clearSinglePost = useCallback(
    async () => dispatch({ type: "CLEAR_SINGLE_POST" }),
    [],
  );

  return (
    <PostContext.Provider
      value={{
        ...state,
        fetchAllPosts,
        fetchPostById,
        createNewPost,
        updateExistingPost,
        deleteExistingPost,
        addCommentToPost,
        clearMutationError,
        clearFeedError,
        clearSinglePost,
      }}
    >
      {children}
    </PostContext.Provider>
  );
};
