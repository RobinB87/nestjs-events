import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const gqlContext = GqlExecutionContext.create(ctx);
    if (gqlContext) {
      // in gql context, hence use it
      return gqlContext.getContext().req.user;
    }

    // otherwise follow normal procedure
    const request = ctx.switchToHttp().getRequest();
    return request.user ?? null;
  },
);
