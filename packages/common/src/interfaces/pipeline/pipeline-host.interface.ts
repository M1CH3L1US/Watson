import { BaseRoute } from '../router';
import { CommandPipeline } from './command-pipeline.interface';
import { EventPipeline } from './event-pipeline.interface';
import { SlashPipeline } from './slash-pipeline.interface';

export type ContextType = "command" | "event" | "slash";

export interface PipelineHost {
  /**
   * Returns the CommandPipelineHost class for
   * this executions context.
   */
  switchToCommand(): CommandPipeline;
  /**
   * Returns the SlashPipelineHost class for
   * this executions context.
   */
  switchToSlash(): SlashPipeline;
  /**
   * Returns the EventPipelineHost class for
   * this executions context.
   */
  switchToEvent(): EventPipeline;
  /**
   * Returns the context type of this execution context
   */
  getType<T extends string = ContextType>(): T;
  /**
   * Returns the internal route
   * which was mapped to the event
   * handler
   */
  getRoute(): BaseRoute;
}
