export type PostDataResult<T, U> = {
  success: boolean;
  value?: U;
  errors?: { [P in keyof T]?: string[] };
};

type ServerErrorType = { body: string };

export interface HttpResponse<T> extends Response {
  parsedBody?: T & ServerErrorType;
}

const ABORT_REQUEST_CONTROLLERS = new Map();

export async function http<T>(request: RequestInfo): Promise<HttpResponse<T>> {
  const response: HttpResponse<T> = await fetch(request);

  try {
    // may error if there is no body
    response.parsedBody = await response.json();
  } catch (ex) {}

  if (!response.ok) {
    console.error('Server Error: ', response.parsedBody?.body);
    throw new Error(response.statusText);
  }
  return response;
}
export async function get<T>(
  path: string,
  signalKey: string | undefined = undefined,
  args: RequestInit = { method: 'get', signal: !!signalKey ? abortAndGetSignalSafe(signalKey) : null }
): Promise<HttpResponse<T>> {
  return await http<T>(new Request(path, args));
}

export async function post<T>(path: string, body: any, args: RequestInit = { method: 'post', body: JSON.stringify(body) }): Promise<HttpResponse<T>> {
  return await http<T>(new Request(path, args));
}

export function abortRequestSafe(key: string, reason = 'CANCELLED') {
  ABORT_REQUEST_CONTROLLERS.get(key)?.abort?.(reason);
}

function abortAndGetSignalSafe(key: string) {
  abortRequestSafe(key); // abort previous request, if any
  const newController = new AbortController();
  ABORT_REQUEST_CONTROLLERS.set(key, newController);
  return newController.signal;
}
