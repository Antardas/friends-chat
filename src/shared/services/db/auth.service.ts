import { IAuthDocument } from '../../../features/auth/interfaces/auth.interface';
import { Auth } from '../../../features/auth/models/auth.scheme';
import { Helpers } from '../../../shared/globals/helpers/helpers';

class AuthService {
  public async getUserByUsernameOrEmail(username: string, email: string): Promise<IAuthDocument> {
    const query = {
      $or: [
        {
          username: Helpers.firstLetterUpperCase(username),
          email: Helpers.lowerCase(email)
        }
      ]
    };

    const user: IAuthDocument = (await Auth.findOne(query).exec()) as IAuthDocument;

    return user;
  }
}

export const authService: AuthService = new AuthService();
