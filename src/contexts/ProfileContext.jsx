import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
} from "react";
import * as api from "../api/reqs";

const ProfileContext = createContext(null);
export const useProfile = () => useContext(ProfileContext);

const initialState = {
  profileUser: null,
  profilePosts: [],
  mainUserProfile: null,
  mainUserPosts: [],
  isProfileLoading: false,
  profileError: null,
};

const profileReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_PROFILE_START":
      return { ...state, isProfileLoading: true, profileError: null };
    case "FETCH_PROFILE_FAIL":
      return {
        ...state,
        isProfileLoading: false,
        profileError: action.payload,
      };
    case "FETCH_PROFILE_SUCCESS": {
      const loggedInUser = JSON.parse(localStorage.getItem("user") || "null");
      const isMainUser =
        loggedInUser?.id &&
        String(action.payload.userId) === String(loggedInUser.id);

      return {
        ...state,
        isProfileLoading: false,
        profileUser: action.payload.user,
        profilePosts: action.payload.posts,
        // Seed the main user profile cache if this direct fetch belongs to the main user
        ...(isMainUser
          ? {
              mainUserProfile: action.payload.user,
              mainUserPosts: action.payload.posts,
            }
          : {}),
      };
    }
    case "LOAD_MAIN_USER_FROM_CACHE":
      return {
        ...state,
        isProfileLoading: false,
        profileUser: state.mainUserProfile,
        profilePosts: state.mainUserPosts,
        profileError: null,
      };

    case "FETCH_MAIN_PROFILE_SUCCESS":
      return {
        ...state,
        isProfileLoading: false,
        profileUser: state.profileUser
          ? state.profileUser
          : action.payload.user,
        profilePosts:
          state.profilePosts.length > 0
            ? state.profilePosts
            : action.payload.posts,
        mainUserProfile: action.payload.user,
        mainUserPosts: action.payload.posts,
      };

    case "SYNC_CREATE_POST": {
      const newPost = action.payload;
      const isOwnPost =
        String(newPost.author?.id) === String(state.mainUserProfile?.id);
      const isCurrentProfilePost =
        String(state.profileUser?.id) === String(newPost.author?.id);

      // Dynamically update metrics counters on live addition
      const updatedProfileUser =
        state.profileUser && isCurrentProfilePost
          ? {
              ...state.profileUser,
              posts_count: (state.profileUser.posts_count || 0) + 1,
            }
          : state.profileUser;

      const updatedMainUser =
        state.mainUserProfile && isOwnPost
          ? {
              ...state.mainUserProfile,
              posts_count: (state.mainUserProfile.posts_count || 0) + 1,
            }
          : state.mainUserProfile;

      return {
        ...state,
        profileUser: updatedProfileUser,
        mainUserProfile: updatedMainUser,
        mainUserPosts: isOwnPost
          ? [newPost, ...state.mainUserPosts]
          : state.mainUserPosts,
        profilePosts: isCurrentProfilePost
          ? [newPost, ...state.profilePosts]
          : state.profilePosts,
      };
    }
    case "SYNC_EDIT_POST": {
      const updatedPost = action.payload;
      const updateList = (list) =>
        list.map((p) => (p.id === updatedPost.id ? updatedPost : p));
      return {
        ...state,
        profilePosts: updateList(state.profilePosts),
        mainUserPosts: updateList(state.mainUserPosts),
      };
    }
    case "SYNC_DELETE_POST": {
      const postId = action.payload;
      const isOwnPostDeleted = state.mainUserPosts.some((p) => p.id === postId);
      const isProfilePostDeleted = state.profilePosts.some(
        (p) => p.id === postId,
      );

      // Dynamically update metrics counters on live deletion
      const updatedProfileUser =
        state.profileUser && isProfilePostDeleted
          ? {
              ...state.profileUser,
              posts_count: Math.max(
                0,
                (state.profileUser.posts_count || 1) - 1,
              ),
            }
          : state.profileUser;

      const updatedMainUser =
        state.mainUserProfile && isOwnPostDeleted
          ? {
              ...state.mainUserProfile,
              posts_count: Math.max(
                0,
                (state.mainUserProfile.posts_count || 1) - 1,
              ),
            }
          : state.mainUserProfile;

      const filterList = (list) => list.filter((p) => p.id !== postId);
      return {
        ...state,
        profileUser: updatedProfileUser,
        mainUserProfile: updatedMainUser,
        profilePosts: filterList(state.profilePosts),
        mainUserPosts: filterList(state.mainUserPosts),
      };
    }

    case "RESET_PROFILE":
      return {
        ...state,
        profileUser: null,
        profilePosts: [],
        profileError: null,
        isProfileLoading: false,
      };

    default:
      return state;
  }
};

export const ProfileProvider = ({ children }) => {
  const [state, dispatch] = useReducer(profileReducer, initialState);

  // == FETCH USER ==
  const fetchUserProfileData = useCallback(async (userId) => {
    dispatch({ type: "FETCH_PROFILE_START" });
    try {
      const userRes = await api.getUser(userId);
      const postsRes = await api.getUserPosts(userId);
      if (userRes.success && postsRes.success) {
        dispatch({
          type: "FETCH_PROFILE_SUCCESS",
          payload: {
            user: userRes.data.data,
            posts: postsRes.data?.data || postsRes.data,
            userId,
          },
        });
      } else {
        dispatch({
          type: "FETCH_PROFILE_FAIL",
          payload: userRes.error || "Failed loading profile.",
        });
      }
    } catch (err) {
      dispatch({ type: "FETCH_PROFILE_FAIL", payload: err.message });
    }
  }, []);

  // == LOAD CACHED STATE ==
  const loadMainUserFromCache = useCallback(() => {
    dispatch({ type: "LOAD_MAIN_USER_FROM_CACHE" });
  }, []);

  // == FETCH MAIN USER ==
  const preloadMainUser = useCallback(async () => {
    const loggedInUser = JSON.parse(localStorage.getItem("user") || "null");
    if (!loggedInUser?.id || state.mainUserProfile) return;

    try {
      const userResponse = await api.getUser(loggedInUser.id);
      const postsResponse = await api.getUserPosts(loggedInUser.id);
      if (userResponse.success && postsResponse.success) {
        dispatch({
          type: "FETCH_MAIN_PROFILE_SUCCESS",
          payload: {
            user: userResponse.data?.data,
            posts: postsResponse.data?.data || postsResponse.data,
          },
        });
      }
    } catch (err) {
      console.error("Failed preloading main profile state:", err);
    }
  }, [state.mainUserProfile]);

  // == ACTIONS SYNCHRONIZATIONS ==
  const syncCreate = useCallback(
    (post) => dispatch({ type: "SYNC_CREATE_POST", payload: post }),
    [],
  );
  const syncEdit = useCallback(
    (post) => dispatch({ type: "SYNC_EDIT_POST", payload: post }),
    [],
  );
  const syncDelete = useCallback(
    (id) => dispatch({ type: "SYNC_DELETE_POST", payload: id }),
    [],
  );

  // == CLEANERS ==
  const resetProfile = useCallback(
    () => dispatch({ type: "RESET_PROFILE" }),
    [],
  );

  return (
    <ProfileContext.Provider
      value={{
        ...state,
        fetchUserProfileData,
        loadMainUserFromCache,
        preloadMainUser,
        resetProfile,
        syncCreate,
        syncEdit,
        syncDelete,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};
