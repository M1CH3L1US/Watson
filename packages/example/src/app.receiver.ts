import { Ask, AskFunction, Command, Receiver } from '@watson/common';

@Receiver()
export class AppReceiver {
  @Command("ping")
  async handle(@Ask() askFn: AskFunction) {
    console.log("Hey");
    const response = await askFn("What's your name?");

    return;
  }
}
