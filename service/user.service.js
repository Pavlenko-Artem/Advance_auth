import bcrypt from 'bcrypt';
import * as uuid from 'uuid';

import mailService from './mail.service.js';
import tokenService from './token.service.js';
import UserDto from '../dtos/user.dto.js';
import { UserModel } from '../models/user.model.js';

class UserService {
  async registration(email, password) {
    const candidate = await UserModel.findOne({ email });
    if (candidate) {
      throw new Error(
        `Пользователь с почтовым адресом ${email} уже существует`
      );
    }
    const hashPassword = await bcrypt.hash(password, 3);
    const activationLink = uuid.v4();

    const user = await UserModel.create({
      email,
      password: hashPassword,
      activationLink
    });

    await mailService.sendActivationMail(
      email,
      `http://localhost:5000/api/activate/${activationLink}`
    );

    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return {
      ...tokens,
      user: userDto
    };
  }
}

export default new UserService();
