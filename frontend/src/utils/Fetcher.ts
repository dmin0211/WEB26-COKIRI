import axios, { AxiosRequestConfig, AxiosRequestHeaders } from 'axios';
import { QueryFunctionContext } from 'react-query';

import {
  UserType,
  PostType,
  LikeType,
  ReturnType,
  CommentType,
  RepoType,
  ProblemType,
  DashboardUserInfoType,
  ExternalType,
  BlogType,
  StatisticsType,
  HistoryType,
  StackType,
  NotificationType,
  DashboardRepoType,
  LanguageStatisticsType,
} from 'src/types';

import { NOT_EXIST_TOKEN } from 'src/globals/errors';

const baseURL = process.env.NEXT_PUBLIC_SERVER_URL;
const version = 'v1';

async function run(requestConfig: AxiosRequestConfig) {
  const url = `${baseURL}/${version}/${requestConfig.url}`;
  const result = await axios.request({ ...requestConfig, url });
  return result.data;
}

function getAuthHeader({
  token,
  headers,
}: {
  token: string;
  headers?: AxiosRequestHeaders;
}): AxiosRequestHeaders {
  if (!token) {
    throw new Error(NOT_EXIST_TOKEN);
  }
  const authorizationHeader = { Authorization: `Bearer ${token}` };
  return headers ? { ...headers, ...authorizationHeader } : authorizationHeader;
}

function get<R>(config: AxiosRequestConfig): Promise<ReturnType<R>> {
  return run({ ...config, method: 'GET' });
}

function post<R>(config: AxiosRequestConfig): Promise<ReturnType<R>> {
  return run({ ...config, method: 'POST' });
}

function put<R>(config: AxiosRequestConfig): Promise<ReturnType<R>> {
  return run({ ...config, method: 'PUT' });
}

function del<R>(config: AxiosRequestConfig): Promise<ReturnType<R>> {
  return run({ ...config, method: 'DELETE' });
}

function getWithAuth<R, P = object>(config: {
  url: string;
  token: string;
  params?: P;
  headers?: AxiosRequestHeaders;
}): Promise<ReturnType<R>> {
  return run({ ...config, headers: getAuthHeader(config), method: 'GET' });
}

function postWithAuth<R, D = object>(config: {
  url: string;
  token: string;
  data?: D;
  headers?: AxiosRequestHeaders;
}): Promise<ReturnType<R>> {
  return run({ ...config, headers: getAuthHeader(config), method: 'POST' });
}

function putWithAuth<R, D = object>(config: {
  url: string;
  token: string;
  data?: D;
  headers?: AxiosRequestHeaders;
}): Promise<ReturnType<R>> {
  return run({ ...config, headers: getAuthHeader(config), method: 'PUT' });
}

function deleteWithAuth<R, D = object>(config: {
  url: string;
  token: string;
  data?: D;
  headers?: AxiosRequestHeaders;
}): Promise<ReturnType<R>> {
  return run({ ...config, headers: getAuthHeader(config), method: 'DELETE' });
}

const Fetcher = {
  // for server side
  async getUsersMe(token: string) {
    const result = await getWithAuth<UserType>({ url: 'users/me', token });
    return result.data;
  },

  async getUsersByUsername(token: string, username: string) {
    const result = await getWithAuth<UserType>({ url: 'users', token, params: { username } });
    return result.data;
  },

  async getDashboardUserInfo(username: string): Promise<DashboardUserInfoType> {
    try {
      const result = await axios.get(`${baseURL}/${version}/users/dashboard`, {
        params: { username },
      });
      return result.data.data;
    } catch {
      return { username: '' };
    }
  },

  async getFirstPost(user: UserType, token: string): Promise<PostType> {
    if (user._id === undefined || !user.isRegistered) {
      return {};
    }
    const result = await axios.get(`${baseURL}/${version}/posts`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { user_id: user._id, cursor: 0 },
    });
    return result.data.data[0];
  },

  // for client side
  getPosts(user: UserType, { pageParam }: QueryFunctionContext) {
    if (user._id === undefined || !user.isRegistered) {
      return {};
    }
    return getWithAuth<PostType[]>({
      url: 'posts',
      token: user.token!,
      params: { user_id: user._id, cursor: pageParam ?? 1 },
    });
  },

  async getPostLikes(user: UserType, postID: string) {
    const result = await getWithAuth<LikeType[]>({
      url: `posts/${postID}/likes`,
      token: user.token!,
    });
    return result.data;
  },

  getUserPosts(user: UserType, { pageParam }: QueryFunctionContext) {
    if (user._id === undefined) {
      return {};
    }
    return get<PostType[]>({ url: `users/${user._id}/posts`, params: { cursor: pageParam ?? 0 } });
  },

  async getSearch(query: string) {
    const result = await get<UserType[]>({ url: 'search', params: { query } });
    return result.data;
  },

  async getIsExistUsername(username: string) {
    const result = await get<boolean>({ url: 'users', params: { query: username } });
    return result.data;
  },

  async getUserSuggestions(user: UserType) {
    if (user._id === undefined || !user.isRegistered) {
      return [];
    }
    const result = await getWithAuth<UserType[]>({
      url: `users/${user._id}/suggestions`,
      token: user.token!,
    });
    return result.data;
  },

  getRandomPosts({ pageParam }: QueryFunctionContext) {
    return get<PostType[]>({ url: 'posts/random', params: { cursor: pageParam ?? 0 } });
  },

  async getDetailPost(postID: string) {
    const result = await get<PostType>({ url: `posts/${postID}` });
    return result.data;
  },

  async getUserRepos(user: UserType) {
    const result = await getWithAuth<RepoType[]>({
      url: `users/${user._id}/repositories`,
      token: user.token!,
    });
    return result.data;
  },

  async getUserRepo(user: UserType, repoName: string) {
    const result = await getWithAuth<ExternalType>({
      url: `users/${user._id}/repositories/${repoName}`,
      token: user.token!,
    });
    return result.data;
  },

  async getUserFollows(targetUserID: string) {
    const result = await get<UserType[]>({ url: `users/${targetUserID}/follows` });
    return result.data;
  },

  async getUserFollowers(targetUserID: string) {
    const result = await get<UserType[]>({ url: `users/${targetUserID}/followers` });
    return result.data;
  },

  async getProblems(query: string) {
    const result = await get<ProblemType[]>({ url: 'problems', params: { query } });
    return result.data;
  },

  async getProblem(id: string) {
    const result = await get<ExternalType>({ url: `problems/${id}` });
    return result.data;
  },

  async getUserBlogs(user: UserType) {
    const result = await getWithAuth<BlogType[]>({
      url: `users/${user._id}/blogs`,
      token: user.token!,
    });
    return result.data;
  },

  async getUserBlog(user: UserType, identity: string, postID: string) {
    const result = await getWithAuth<ExternalType>({
      url: `users/${user._id}/tistory/${identity}/posts/${postID}`,
      token: user.token!,
    });
    return result.data;
  },

  async getDashboardUserInfo(username: string) {
    const result = await get<DashboardUserInfoType>({
      url: `users/dashboard?username=${username}`,
    });
    return result.data;
  },

  async getTistoryAuthURL(user: UserType, redirectURI: string) {
    const result = await getWithAuth<string>({
      url: 'socials/tistory',
      token: user.token!,
      params: { redirect_uri: redirectURI },
    });
    return result.data;
  },

  async getDashboardRepo(userID: string) {
    const result = await get<RepoType[]>({ url: `users/${userID}/dashboard/repositories` });
    return result.data;
  },

  async getDashboardLanguageStatistics(userID: string) {
    const result = await get<StatisticsType>({
      url: `users/${userID}/dashboard/repositories/languages`,
    });
    return result.data;
  },

  async getTechStacksSearch(query: string): Promise<StackType[]> {
    const result = await axios.get(`${baseURL}/${version}/techStacks/search?`, {
      params: { query },
    });
    return result.data.data;
  },

  async getProblemStatistics(userID: string): Promise<StatisticsType> {
    const result = await axios.get(
      `${baseURL}/${version}/users/${userID}/dashboard/problems/statistics`,
    );
    return result.data.data;
  },

  async postPost(
    user: UserType,
    content: string,
    images: string[],
    external?: ExternalType,
  ): Promise<ReturnType<PostType>> {
    const result = await axios.post<PostType>(
      `${baseURL}/${version}/posts`,
      { userID: user._id, content, images, external },
      { headers: { Authorization: `Bearer ${user.token}` } },
    );
    return result.data;
  },

  async getUserNotifications(user: UserType): Promise<NotificationType[]> {
    const result = await axios.get(`${baseURL}/${version}/users/${user._id}/notifies`, {
      headers: { Authorization: `Bearer ${user.token}` },
    });

    return result.data.data;
  },

  async postPostLike(user: UserType, postID: string): Promise<ReturnType<LikeType>> {
    const result = await axios.post(
      `${baseURL}/${version}/posts/${postID}/likes`,
      { userID: user._id },
      { headers: { Authorization: `Bearer ${user.token}` } },
    );
    return result.data;
  },

  async postPostComment(
    user: UserType,
    postID: string,
    content: string,
  ): Promise<ReturnType<CommentType>> {
    const result = await axios.post(
      `${baseURL}/${version}/posts/${postID}/comments`,
      { userID: user._id, content },
      { headers: { Authorization: `Bearer ${user.token}` } },
    );
    return result.data;
  },

  async postCommentLike(
    user: UserType,
    postID: string,
    commentID: string,
  ): Promise<ReturnType<LikeType>> {
    const result = await axios.post(
      `${baseURL}/${version}/posts/${postID}/comments/${commentID}/likes`,
      { userID: user._id },
      { headers: { Authorization: `Bearer ${user.token}` } },
    );
    return result.data;
  },

  async postDashboardHistory(user: UserType, content: string, date: string): Promise<HistoryType> {
    const result = await axios.post(
      `${baseURL}/${version}/users/${user._id}/dashboard/histories`,
      { content, date },
      { headers: { Authorization: `Bearer ${user.token}` } },
    );
    return result.data;
  },

  async postDashboardRepo(user: UserType, repoName: string): Promise<ReturnType<RepoType>> {
    const result = await axios.post(
      `${baseURL}/${version}/users/${user._id}/dashboard/repositories/${repoName}`,
      { userID: user._id },
      { headers: { Authorization: `Bearer ${user.token}` } },
    );
    return result.data;
  },

  async putUserFollow(user: UserType, targetUserID: string): Promise<void> {
    await axios.post(
      `${baseURL}/${version}/users/${targetUserID}/follows`,
      { userID: user._id },
      { headers: { Authorization: `Bearer ${user.token}` } },
    );
  },

  async putUserSettings(user: UserType, newUser: UserType): Promise<void> {
    await axios.put(
      `${baseURL}/${version}/users/${user._id}/settings`,
      {
        username: newUser.username,
        name: newUser.name,
        profileImage: newUser.profileImage,
        bio: newUser.bio,
      },
      { headers: { Authorization: `Bearer ${user.token}` } },
    );
  },

  async putDashboardUserInfo(
    user: UserType,
    dashboard: DashboardUserInfoType,
  ): Promise<DashboardUserInfoType> {
    const result = await axios.put(
      `${baseURL}/${version}/users/${user._id}/dashboard`,
      {
        name: dashboard.name,
        profileImage: dashboard.profileImage,
        phoneNumber: dashboard.phoneNumber,
        school: dashboard.school,
        region: dashboard.region,
        birthday: dashboard.birthday,
        jobObjectives: dashboard.jobObjectives,
        techStacks: dashboard.techStacks,
        email: dashboard.email || undefined,
        github: dashboard.github || undefined,
        blog: dashboard.blog || undefined,
        solvedac: dashboard.solvedac || undefined,
      },
      { headers: { Authorization: `Bearer ${user.token}` } },
    );
    return result.data.data;
  },

  async putDashboardRepoLanguages(user: UserType): Promise<LanguageStatisticsType> {
    const result = await axios.put(
      `${baseURL}/${version}/users/${user._id}/dashboard/repositories/languages`,
      {
        headers: { Authorization: `Bearer ${user.token}` },
      },
    );
    return result.data.data.dashboard.statistics;
  },

  async putProblemStatistics(
    user: UserType,
    solvedacUsername: string,
  ): Promise<StatisticsType> {
    const result = await axios.put(
      `${baseURL}/${version}/users/${user._id}/dashboard/problems/${solvedacUsername}/statistics`,
      { userID: user._id },
      { headers: { Authorization: `Bearer ${user.token}` } },
    );
    return result.data.data;
  },

  async deletePostLike(user: UserType, postID: string, likeID: string): Promise<void> {
    await axios.delete(`${baseURL}/${version}/posts/${postID}/likes/${likeID}`, {
      data: { userID: `${user._id}` },
      headers: { Authorization: `Bearer ${user.token}` },
    });
  },

  async deleteUserFollow(user: UserType, targetUserID: string): Promise<void> {
    await axios.delete(`${baseURL}/${version}/users/${targetUserID}/follows`, {
      data: { userID: user._id },
      headers: { Authorization: `Bearer ${user.token}` },
    });
  },

  async deleteCommentLike(
    user: UserType,
    postID: string,
    commentID: string,
    likeID: string,
  ): Promise<void> {
    await axios.delete(
      `${baseURL}/${version}/posts/${postID}/comments/${commentID}/likes/${likeID}`,
      {
        data: { userID: `${user._id}` },
        headers: { Authorization: `Bearer ${user.token}` },
      },
    );
  },

  async deletePost(user: UserType, postID: string): Promise<void> {
    await axios.delete(`${baseURL}/${version}/posts/${postID}`, {
      data: { userID: `${user._id}` },
      headers: { Authorization: `Bearer ${user.token}` },
    });
  },

  async deleteComment(user: UserType, postID: string, commentID: string): Promise<void> {
    await axios.delete(`${baseURL}/${version}/posts/${postID}/comments/${commentID}`, {
      data: { userID: user._id },
      headers: { Authorization: `Bearer ${user.token}` },
    });
  },

  async deleteDashboardHistory(user: UserType, historyID: string): Promise<void> {
    await axios.delete(`${baseURL}/${version}/users/${user._id}/dashboard/histories`, {
      data: { historyID },
      headers: { Authorization: `Bearer ${user.token}` },
    });
  },

  async deleteDashboardRepo(user: UserType, repoName: string): Promise<void> {
    await axios.delete(
      `${baseURL}/${version}/users/${user._id}/dashboard/repositories/${repoName}`,
      {
        data: { userID: user._id },
        headers: { Authorization: `Bearer ${user.token}` },
      },
    );
  },
};

export default Fetcher;
