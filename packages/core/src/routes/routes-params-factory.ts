import {
  AskFunction,
  CollectFunction,
  CommandContextData,
  ContextData,
  ExecutionContext,
  IInquirableMetadata,
  InquirableType,
  IParamDecoratorMetadata,
  isFunction,
  isString,
  ParamFactoryFunction,
  ReactFunction,
  RouteParamType,
} from '@watson/common';
import {
  AwaitMessagesOptions,
  AwaitReactionsOptions,
  CollectorFilter,
  Message,
  MessageEmbed,
  MessageReaction,
  User,
} from 'discord.js';
import { AsyncContextResolver, EventExecutionContext } from 'lifecycle';

export class RouteParamsFactory {
  private asyncResolver = new AsyncContextResolver();

  public async createFromContext(
    paramTypes: IParamDecoratorMetadata[],
    ctx: ExecutionContext
  ) {
    const data = ctx.getContextData<ContextData>();
    const params: unknown[] = [];

    for (const type of paramTypes) {
      const idx = type.paramIndex;
      switch (type.type) {
        case RouteParamType.CHANNEL:
          params[idx] = (data as CommandContextData).channel;
          break;
        case RouteParamType.CLIENT:
          params[idx] = data.client;
          break;
        case RouteParamType.CONTEXT:
          params[idx] = ctx;
          break;
        case RouteParamType.GUILD:
          params[idx] = data.guild;
          break;
        case RouteParamType.MESSAGE:
          params[idx] = data as CommandContextData;
          break;
        case RouteParamType.PARAM:
          const param = type.options;
          params[idx] = isString(param)
            ? (data as CommandContextData).params[param]
            : (data as CommandContextData).params;
          break;
        case RouteParamType.USER:
          params[idx] = (data as CommandContextData).user;
          break;
        case RouteParamType.FACTORY:
          param[idx] = await this.fromParamFactory(ctx, type.factory);
          break;
        case RouteParamType.INQUIRABLE:
          param[idx] = this.fromInquirable(
            ctx as EventExecutionContext<CommandContextData>,
            (type.options as IInquirableMetadata).type
          );
        default:
          param[idx] = undefined;
      }
    }

    return params;
  }

  private async fromParamFactory(
    ctx: ExecutionContext,
    factory: ParamFactoryFunction
  ) {
    if (isFunction(factory)) {
      return undefined;
    }

    const factoryResult = factory(ctx);
    return this.asyncResolver.resolveAsyncValue(factoryResult);
  }

  private fromInquirable(
    ctx: EventExecutionContext<CommandContextData>,
    type: InquirableType
  ) {
    switch (type) {
      case InquirableType.ASK:
        return this.createAskInquirable(ctx);
      case InquirableType.REACT:
        return this.createReactInquirable(ctx);
      case InquirableType.COLLECT:
        return this.createCollectionInquirable(ctx);
    }
  }

  private createAskInquirable(
    ctx: EventExecutionContext<CommandContextData>
  ): AskFunction {
    const { channel } = ctx.getContextData();
    const askFilter = (message: Message) =>
      message.author.id === ctx.getContextData().user.id;

    return async (
      message: string | MessageEmbed,
      options: AwaitMessagesOptions = {}
    ) => {
      await channel.send(message);

      const { time = 10000 } = options;
      const result = await channel.awaitMessages(askFilter, {
        ...options,
        max: 1,
        time: time,
      });

      if (result.size === 0) {
        return undefined;
      }

      return result.first();
    };
  }

  private createReactInquirable(
    ctx: EventExecutionContext<CommandContextData>
  ): ReactFunction {
    const { channel } = ctx.getContextData();

    return async (
      message: string | MessageEmbed,
      options: AwaitReactionsOptions = {},
      customReactionFilter?: CollectorFilter
    ) => {
      const messageRef = await channel.send(message);

      const { time = 10000 } = options;
      const reactionFilter = customReactionFilter
        ? customReactionFilter
        : (reaction: MessageReaction, user: User) =>
            user.id === ctx.getContextData().user.id;

      const result = await messageRef.awaitReactions(reactionFilter, {
        ...options,
        time,
      });

      if (result.size === 0) {
        return undefined;
      }

      return result.array();
    };
  }

  private createCollectionInquirable(
    ctx: EventExecutionContext<CommandContextData>
  ): CollectFunction {
    const { channel } = ctx.getContextData();

    return async (
      message: string | MessageEmbed,
      filter: CollectorFilter,
      type,
      options = {}
    ) => {
      const { time = 10000 } = options;
      const messageRef = channel.send(message);

      if (type === "message") {
        const result = await channel.awaitMessages(filter, {
          ...options,
          time,
        });

        return result.array();
      } else if (type === "reaction") {
        const result = await (await messageRef).awaitReactions(filter, {
          ...options,
          time,
        });

        return result.array();
      }
    };
  }
}