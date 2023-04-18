import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { SECRET_KEY } from '.';
import { TokenTypes } from '@/interfaces/auth.interface';
import { DB } from '@/database';

const jwtOptions = {
  secretOrKey: SECRET_KEY,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const jwtVerify = async (payload, done) => {
  try {
    if (payload.type !== TokenTypes.ACCESS) {
      throw new Error('Invalid token type');
    }

    const user = await DB.Users.findByPk(payload.sub);
    if (!user) {
      return done(null, false);
    }
    done(null, user);
  } catch (error) {
    done(error, false);
  }
};

const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

export default jwtStrategy;
