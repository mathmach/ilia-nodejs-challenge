import * as bcryptjs from 'bcryptjs';

export const Encrypt = {

  cryptPassword: (password: string) =>
    bcryptjs.genSalt(10)
      .then((salt => bcryptjs.hash(password, salt)))
      .then(hash => hash),

  comparePassword: (password: string, hashPassword: string) =>
    bcryptjs.compare(password, hashPassword)
      .then(resp => resp)

}