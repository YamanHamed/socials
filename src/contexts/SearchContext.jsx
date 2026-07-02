import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { getUsers } from "../api/reqs";
// this is not a real search context, becasue the API does not support a search route
// so in this context I fetched some of the latest users to search in

const SearchContext = createContext(null);

export const SearchProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [userCache, setUserCache] = useState([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);

  // == FETCH USERS ==
  const initializeSearchCache = useCallback(async () => {
    if (userCache.length > 0 || isSearchLoading) return;
    setIsSearchLoading(true);

    try {
      const limitPerPage = 50;
      const firstPageRes = await getUsers(1, limitPerPage);
      if (!firstPageRes.success) throw new Error(firstPageRes.error);

      const page1Users = firstPageRes.data.data || [];
      const paginationMeta = firstPageRes.data.meta || {};
      const lastPageNum = paginationMeta.last_page || 1;

      let combinedUsers = [...page1Users];
      const secondaryRequests = [];

      if (lastPageNum > 1) {
        secondaryRequests.push(getUsers(lastPageNum, limitPerPage));
      }
      if (lastPageNum - 1 > 1) {
        secondaryRequests.push(getUsers(lastPageNum - 1, limitPerPage));
      }

      if (secondaryRequests.length > 0) {
        const responses = await Promise.all(secondaryRequests);
        responses.forEach((res) => {
          if (res.success) {
            combinedUsers = [...combinedUsers, ...(res.data.data || [])];
          }
        });
      }

      const uniqueUsersMap = new Map();
      combinedUsers.forEach((user) => {
        if (user && user.id) uniqueUsersMap.set(user.id, user);
      });

      setUserCache(Array.from(uniqueUsersMap.values()));
    } catch (err) {
      console.error("Search cache error:", err);
    } finally {
      setIsSearchLoading(false);
    }
  }, [userCache.length, isSearchLoading]);

  // == SEARCHED USERS ==
  const filteredResults = useMemo(() => {
    const cleanQuery = searchQuery.trim().toLowerCase();
    if (!cleanQuery) return [];
    return userCache.filter(
      (user) =>
        user.name?.toLowerCase().includes(cleanQuery) ||
        user.username?.toLowerCase().includes(cleanQuery),
    );
  }, [searchQuery, userCache]);

  // == FETCHING USERS WHEN THE CONTEXT LOADS ==
  useEffect(() => {
    initializeSearchCache();
  }, [initializeSearchCache]);

  return (
    <SearchContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
        filteredResults,
        isSearchLoading,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context)
    throw new Error("useSearch must be used within a SearchProvider");
  return context;
};
