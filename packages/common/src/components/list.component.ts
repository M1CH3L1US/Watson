import { CustomComponentException } from '../exceptions';
import { isNil, mergeDefaults } from '../utils';
import { IReactiveOptions, WatsonComponent } from './watson-component';

export interface IListOptions<T extends object = any> extends IReactiveOptions {
  list: string[] | T;
  name: string;
  /**
   * @default formatting ListFormatting.NUMERIC
   */
  formatting?: ListFormatting;
  symbol?: string;
}

export enum ListFormatting {
  NUMERIC = "formatting:numeric",
  SYMBOL = "formatting:symbol",
  OBJECT = "formatting:object",
}

interface ListItem {
  key: unknown;
  value: unknown;
}

const DEFAULT_OPTIONS: IListOptions = {
  list: null,
  name: "List",
  formatting: ListFormatting.NUMERIC,
};

export class ListComponent extends WatsonComponent<IListOptions> {
  constructor(options: IListOptions) {
    options = mergeDefaults(options, DEFAULT_OPTIONS);
    super("", options);
    this.content = this.parse();
  }

  private parse() {
    const { list, formatting, name } = this.options;

    if (isNil(list)) {
      throw new CustomComponentException(
        "The list option for a List Component cannot be null or undefined"
      );
    }

    if (!Array.isArray(list) && formatting !== ListFormatting.OBJECT) {
      throw new CustomComponentException(
        "Non array objects are only supported with the ListFormatting.OBJECT formatting"
      );
    }

    let parseResult: ListItem[];

    if (Array.isArray(list)) {
      parseResult = this.parseList(list);
    } else {
      parseResult = this.parseObject(list);
    }

    return this.createContent(name, parseResult);
  }

  private parseObject(listObj: Object) {
    return Object.entries(listObj).map(([key, value]) => ({ key, value }));
  }

  private parseList(list: string[]) {
    const { formatting } = this.options;

    if (formatting === ListFormatting.SYMBOL) {
      const { symbol } = this.options;

      if (isNil(symbol)) {
        throw new CustomComponentException(
          "Symbol cannot be null or undefined if this formatting option is selected"
        );
      }

      return list.map((entry) => ({ key: symbol, value: entry }));
    } else {
      return list.map((entry, idx) => ({ key: entry, value: idx + 1 }));
    }
  }

  private createContent(title: string, list: ListItem[]) {
    let content = `${title}\n\n`;

    for (const { key, value } of list) {
      content = `${content}${key}: ${value}\n`;
    }

    return this.commandify(content);
  }

  protected onListenerAttach(): void | Promise<void> {
    /* noop */
  }
}
