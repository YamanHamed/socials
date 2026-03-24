import { createContext, useContext, useEffect, useState } from "react";
import { getUsers } from "./Auth";
const UsersContext = createContext();

export const UsersProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [usersRequestInfo, setUsersRequestInfo] = useState({
    status: "initial",
    message: "",
  });

  async function fetchUsers() {
    setUsersRequestInfo({ status: "loading", message: "" });
    const response = await getUsers();
    if (response.success) {
      setUsers(response.data.data);
      console.log(response.data.data);
      setUsersRequestInfo({ status: "success", message: "success" });
    } else {
      console.log(response.error);
      setUsersRequestInfo({
        status: "failure",
        message: "getting Users failed",
      });
      //todo: manage error
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  function searchUser(searchUserName) {
    const searchTerm = searchUserName.toLowerCase();

    if (users.length !== 0) {
      return users.filter((user) => {
        console.log(user);
        return (
          user.username.toLowerCase().includes(searchTerm) ||
          user.email?.toLowerCase().includes(searchTerm)
        );
      });
    } else return [];
  }

  return (
    <UsersContext.Provider value={{ usersRequestInfo, searchUser, fetchUsers }}>
      {children}
    </UsersContext.Provider>
  );
};

export function useUsers() {
  const context = useContext(UsersContext);
  if (!context) {
    throw new Error("useUsers must be used within a UsersProvider");
  }
  return context;
}
