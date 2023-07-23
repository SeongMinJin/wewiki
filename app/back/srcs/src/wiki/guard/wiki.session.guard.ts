import { CanActivate, ExecutionContext, HttpException, HttpStatus } from "@nestjs/common";
import { Observable } from "rxjs";

export class SessionGuard implements CanActivate {
	async canActivate(context: ExecutionContext): Promise<boolean> {
		
		const req = context.switchToHttp().getRequest();
		const name = req.session.user || null;

		if (!name) {
			throw new HttpException({
				"success": false,
				"message": "로그인 해주세요."
			}, HttpStatus.UNAUTHORIZED);
		}

		return true;
	}
}

