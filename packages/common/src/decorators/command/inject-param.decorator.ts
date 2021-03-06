import { RouteParamType } from '../../enums';
import { createParamDecorator } from '../create-param-decorator';

/**
 * Injects the parameters of a command to the argument in the command handler method.
 * @param param The name of the parameter to inject.
 *
 * If no parameter is specified all parameters will be injected as an object.
 * @example
 * ```{
 *  [name]: value
 * }```
 */
export function InjectParam(): ParameterDecorator;
export function InjectParam(param: string): ParameterDecorator;
export function InjectParam(options?: string): ParameterDecorator {
  return createParamDecorator(RouteParamType.PARAM, options);
}

/**
 * Injects the base event data for the current event to the parameter.
 * Be careful though, as the event data is an array of objects even if the
 * event emits only one object.
 *
 * ```
 * \@Event("message")
 * handleMessage(@InjectEvent() [message]: [Message]) {
 *  console.log(message.content);
 * }
 * ```
 */
export function InjectEvent(): ParameterDecorator {
  return createParamDecorator(RouteParamType.EVENT);
}

/**
 * Injects the channel the command was used in to the argument in the command handler method.
 */
export function InjectChannel(): ParameterDecorator {
  return createParamDecorator(RouteParamType.CHANNEL);
}

/**
 * Injects the voice channel the user who has used the command is in
 * to the argument in the command handler method.
 *
 * Is `null` if the user is not in a voice channel.
 */
export function InjectVoiceChannel(): ParameterDecorator {
  return createParamDecorator(RouteParamType.VOICE_CHANNEL);
}

/**
 * Injects the original message object to the argument in the command handler method.
 */
export function InjectMessage(): ParameterDecorator {
  return createParamDecorator(RouteParamType.MESSAGE);
}

/**
 * Injects the DiscordJS client instance to the argument in the command handler method.
 */
export function InjectClient(): ParameterDecorator {
  return createParamDecorator(RouteParamType.CLIENT);
}

/**
 * Injects the guild the command was used in to the argument in the command handler method.
 *
 * If the command was used in a direct message the value will be `undefined`.
 */
export function InjectGuild(): ParameterDecorator {
  return createParamDecorator(RouteParamType.GUILD);
}

/**
 * Injects the user Inject whom the message was sent Inject to the argument in the command handler method.
 */
export function InjectUser(): ParameterDecorator {
  return createParamDecorator(RouteParamType.USER);
}

/**
 * Injects the full command context to the argument in the command handler method.
 */
export function InjectContext(): ParameterDecorator {
  return createParamDecorator(RouteParamType.CONTEXT);
}
