import { post, HttpResponse, PostDataResult } from '_utils/Http';

type FormDataType<T> = {
  inputs: T;
  dirtyFields: { [P in keyof T]?: boolean };
};

export async function fetchPostData<T>(url: string, formData: FormDataType<T>) {
  let response: HttpResponse<PostDataResult<T>>;
  try {
    console.log('formData', formData); // TODO: debug
    response = await post<PostDataResult<T>>(url, formData);
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
