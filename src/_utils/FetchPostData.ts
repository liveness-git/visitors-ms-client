import { post, get, HttpResponse, PostDataResult } from '_utils/Http';

export async function fetchPostData<T>(url: string, formData: T) {
  let response: HttpResponse<PostDataResult<T>>;
  try {
    // response = await post<postDataResult<Inputs>>(url, formData);
    response = await get<PostDataResult<T>>(url); // TODO: get→postへの切り替え
    console.log('formData', formData); // TODO: debug
    console.log('response', response); // TODO: debug

    const result = response.parsedBody;
    if (result) {
      return Promise.resolve(result);
    } else {
      return Promise.reject(new Error('No Result Error'));
    }
  } catch (error) {
    console.log(error);
    return Promise.reject(error);
  }
}
