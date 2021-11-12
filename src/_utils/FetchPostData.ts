import { post, get, HttpResponse, PostDataResult } from '_utils/Http';

export async function fetchPostData<T>(url: string, formData: T) {
  let response: HttpResponse<PostDataResult<T>>;
  try {
    // TODO: get→postへの切り替え
    // response = await post<postDataResult<Inputs>>(url, formData);
    response = await get<PostDataResult<T>>(url);
    console.log('formData', formData);
    console.log('response', response);

    const result = response.parsedBody;
    if (result) {
      return Promise.resolve(result);
    } else {
      return Promise.reject(new Error('no result'));
    }
  } catch (error) {
    console.log(error);
    return Promise.reject(error);
  }
}
