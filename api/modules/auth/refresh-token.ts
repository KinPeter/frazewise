import { MethodNotAllowedResponse, OkResponse, UnknownErrorResponse } from '../../utils/response';
import { getAccessToken } from '../../utils/crypt-jwt';
import { AuthData, User } from '../../../common/types/auth';

export async function refreshToken(req: Request, user: User): Promise<Response> {
  try {
    if (req.method !== 'POST') return new MethodNotAllowedResponse(req.method);

    const { email, id, isPro } = user;
    const { token, expiresAt } = getAccessToken(email, id);
    return new OkResponse<AuthData>({ id, email, token, expiresAt, isPro });
  } catch (e) {
    return new UnknownErrorResponse(e);
  }
}
