export enum QUERY_KEYS {
  // AUTH KEYS
  CREATE_USER_ACCOUNT = "createUserAccount",
  SIGN_IN_ACCOUNT = "signInAccount",
  SIGN_OUT_ACCOUNT = "signOutAccount",

  // USER KEYS
  GET_CURRENT_USER = "getCurrentUser",
  GET_USERS = "getUsers",
  GET_USER_BY_ID = "getUserById",
  UPDATE_USER = "updateUser",
  DELETE_USER = "deleteUser",

  // POST KEYS
  GET_POSTS = "getPosts",
  GET_INFINITE_POSTS = "getInfinitePosts",
  GET_RECENT_POSTS = "getRecentPosts",
  GET_POST_BY_ID = "getPostById",
  GET_USER_POSTS = "getUserPosts",
  CREATE_POST = "createPost",
  UPDATE_POST = "updatePost",
  DELETE_POST = "deletePost",

  // FILE KEYS
  GET_FILE_PREVIEW = "getFileView",
  GET_FILE_VIEW = "getFileView",  // In case you plan to get view URL for media

  // SEARCH KEYS
  SEARCH_POSTS = "searchPosts",
  SEARCH_USERS = "searchUsers",  // Add if you plan to have user searches
}
