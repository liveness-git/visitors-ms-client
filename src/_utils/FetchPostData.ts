import { post, HttpResponse, PostDataResult } from '_utils/Http';

export async function fetchPostData<T>(url: string, formData: T) {
  let response: HttpResponse<PostDataResult<T>>;
  try {
    response = await post<PostDataResult<T>>(url, formData);
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
