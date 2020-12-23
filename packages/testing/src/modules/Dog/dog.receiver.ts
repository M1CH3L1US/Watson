import { Command, CommandArgumentType, Receiver } from '@watson/common';

@Receiver({
  prefix: "!",
})
export class DogReceiver {
  @Command({
    command: "bark",
    alias: ["woofies", "barkies"],
    params: [
      {
        name: "user",
        type: CommandArgumentType.USER,
        defautl: "@user",
        encapsulator: "asdas",
      },
    ],
  })
  woof() {}
}