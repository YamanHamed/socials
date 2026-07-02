import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL;

export async function register(username, password, name, email, userImage) {
  const respnse = new FormData();
  respnse.append("username", username);
  respnse.append("password", password);
  respnse.append("name", name);
  respnse.append("email", email);
  respnse.append("profile_image", userImage);

  try {
    const response = await axios.post(`${API_BASE_URL}/register`, respnse, {
      headers: {
        "Content-Type": "multipart/form-data",
        Accept: "application/json",
      },
    });

    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }

    console.log(response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.log("Error with log in response data:", error.response?.data);
    return {
      success: false,
      error: error.response?.data?.message || "Login failed",
    };
  }
}
export async function logIn(username, password) {
  console.log("logging in");
  try {
    const response = await axios.post(
      `${API_BASE_URL}/login`,
      {
        username: username,
        password: password,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      },
    );

    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }

    console.log(response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.log("Error with log in response data:", error.response?.data);
    return {
      success: false,
      error: error.response?.data?.message || "Login failed",
    };
  }
}
export async function logOut(username, password) {
  console.log("logging out");
  const token = localStorage.getItem("token");
  try {
    //eslint-disable-next-line
    const response = await axios.post(
      `${API_BASE_URL}/logout`,
      {
        username: username,
        password: password,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return { success: true, data: response.data };
  } catch (error) {
    console.log("Error with log in response data:", error.response?.data);
    return {
      success: false,
      error: error.response?.data?.message || "Login failed",
    };
  }
}
export async function addPost(title, body, image) {
  const token = localStorage.getItem("token");
  const formData = new FormData();
  formData.append("title", title);
  formData.append("body", body);
  formData.append("image", image ? image : {});
  console.log(formData);
  try {
    const response = await axios.post(`${API_BASE_URL}/posts`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        //prettier-ignore
        "Authorization": `Bearer ${token}`,
      },
    });

    console.log(response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.log("Error with log in response data:", error.response?.data);
    return {
      success: false,
      error: error.response?.data?.message || "adding a new post failed",
    };
  }
}
export async function addComment(postId, body) {
  if (!postId) {
    return { success: false, error: "Post ID is required" };
  }

  if (!body || body.trim() === "") {
    return { success: false, error: "Comment cannot be empty" };
  }
  const token = localStorage.getItem("token");
  const bodyObj = {
    body,
  };

  try {
    const response = await axios.post(
      `${API_BASE_URL}/posts/${postId}/comments`,
      bodyObj,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    console.log(response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.log(
      `Error with posting the comment in post ${postId} :`,
      error.response?.data,
    );
    return {
      success: false,
      error: error.response?.data?.message || "adding a new comment failed",
    };
  }
}
export async function editPost(id, title, body, image) {
  const token = localStorage.getItem("token");
  const formData = new FormData();
  formData.append("title", title);
  formData.append("body", body);
  formData.append("image", image);
  formData.append("_method", "PUT");

  try {
    const response = await axios.post(`${API_BASE_URL}/posts/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        //prettier-ignore
        "Authorization": `Bearer ${token}`,
      },
    });

    console.log(response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.log("Error with log in response data:", error.response?.data);
    return {
      success: false,
      error: error.response?.data?.message || "adding a new post failed",
    };
  }
}
export async function getPosts(pagenum, limit = 10) {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/posts?limit=${limit}&page=${pagenum}`,
    );
    return { success: true, data: response.data };
  } catch (error) {
    console.log("Error with getting posts", error.response?.data);
    return {
      success: false,
      error: error.response?.data?.message || "getting posts failed",
    };
  }
}
export async function getPostDetails(postId) {
  if (!postId) {
    return { success: false, error: "Post ID is required" };
  }
  try {
    const response = await axios.get(`${API_BASE_URL}/posts/${postId}`);
    return { success: true, data: response.data };
  } catch (error) {
    console.log(
      `Error with getting post ${postId} details`,
      error.response?.data,
    );
    return {
      success: false,
      error:
        error.response?.data?.message ||
        `getting post ${postId} details failed`,
    };
  }
}
export async function getUserPosts(userId) {
  try {
    const response = await axios.get(`${API_BASE_URL}/users/${userId}/posts`);
    return { success: true, data: response.data };
  } catch (error) {
    console.log("Error with getting posts", error.response?.data);
    return {
      success: false,
      error: error.response?.data?.message || "getting posts failed",
    };
  }
}
export async function deletePost(postId) {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.delete(`${API_BASE_URL}/posts/${postId}`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.log("Error with deleting the post:", error.response?.data);
    return {
      success: false,
      error: error.response?.data?.message || "deleting failed",
    };
  }
}
export async function getUsers(page = 1, limit = 50) {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/users?limit=${limit}&page=${page}`,
    );
    return { success: true, data: response.data };
  } catch (error) {
    console.log("Error with getting users", error.response?.data);
    return {
      success: false,
      error: error.response?.data?.message || "getting users failed",
    };
  }
}
export async function getUser(userId) {
  try {
    const response = await axios.get(`${API_BASE_URL}/users/${userId}`);
    return { success: true, data: response.data };
  } catch (error) {
    console.log("Error with getting user profile", error.response?.data);
    return {
      success: false,
      error: error.response?.data?.message || "getting user profile failed",
    };
  }
}
export function getValidImage(imageFromAPI, defaultImage) {
  // Check if it's an empty object ({})
  if (
    imageFromAPI &&
    typeof imageFromAPI === "object" &&
    Object.keys(imageFromAPI).length === 0
  ) {
    return defaultImage;
  }

  // Check for null/undefined
  if (imageFromAPI === null || imageFromAPI === undefined) {
    return defaultImage;
  }

  // Return the valid image
  return imageFromAPI;
}
export function isValidImage(imageFromAPI) {
  // Check if it's an empty object ({})
  if (
    imageFromAPI &&
    typeof imageFromAPI === "object" &&
    Object.keys(imageFromAPI).length === 0
  ) {
    return false;
  }

  // Check for null/undefined
  if (imageFromAPI === null || imageFromAPI === undefined) {
    return false;
  }

  // Return the valid image
  return true;
}
