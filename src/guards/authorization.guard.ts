import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(private allowedRoles: string[]) {}

  canActivate(context: ExecutionContext): boolean {
    const host = context.switchToHttp(),
      request = host.getRequest();

    const user = request['user'];

    const allowed = this.isAllowed(user.roles);

    console.log('user is allowed ', allowed);

    if (!allowed) {
      console.log('User not authenticated, denying acces...');
      throw new UnauthorizedException();
    }

    return true;
  }

  isAllowed(userRoles: string[]) {
    console.log('comparing roles: ', this.allowedRoles, userRoles);

    let allowed = false;

    userRoles.forEach((userRole) => {
      console.log('checking if roles is allowed ', userRole);
      if (this.allowedRoles.includes(userRole)) {
        allowed = true;
      }
    });

    return allowed;
  }
}
