import { Strategy } from 'passport-local';
import { PassportStrategy, AuthGuard } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
	constructor(private authService: AuthService) {
    super({
			usernameField: "id",
			passwordField: "password",
		});
  }

	async validate(username: string, password: string): Promise<any> {
		const user = await this.authService.validate(username, password);
		if (!user) {
			throw new UnauthorizedException();
		}
		return user;
	}
}

export class LocalAuthGuard extends AuthGuard('local') {}