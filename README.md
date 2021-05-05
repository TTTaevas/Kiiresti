![](https://slippy.xyz/files/f8dd6905-0124-46c6-a9b6-df80cf41df27)
[![Node.js CI](https://github.com/TTTaevas/Kiiresti/actions/workflows/node.js.yml/badge.svg)](https://github.com/TTTaevas/Kiiresti/actions/workflows/node.js.yml)

# Kiiresti

Kiiresti is an open-source Discord bot you can use to get content from [speedrun.com](https://www.speedrun.com) onto your Discord server.

*note that it is currently under development on [this Discord Server](https://discord.gg/ZcKbgqxq2C), so everything is subject to change, including this README file*

## Commands

### >ki help <command>

This allows you to get more info on the bot's commands. You can get more info on a specific command by using the optional `command` argument. You can get more info on `>ki recent` using `>ki help recent`!

### >ki recent <user>

This command allows you to get a user's most recent run, as well as some of their old runs on the same game and category. The `user` argument is optional if the user doing that command has done `>ki user` before.

### >ki user <user>

This allows you to "associate" your Discord account to a speedrun.com user, meaning that, if you use `>ki user <your_name_on_speedrun.com>` and then do `>ki recent` (without an argument), the bot will get your most recent run, instead of sending an error message!

### >ki compare <user>

That command works the same way as `>ki recent`, except that it gets runs only from the last game and category seen in that same Discord channel. For example, if "USER_A" does `>ki recent` to get their run on [https://www.speedrun.com/tmnf#White](TMNF (White)) into the #bot-spam channel, "USER_B" can use `>ki compare` to get their own run on that same game and category, in that same channel.

### >ki top (followed by your arguments)

That allows you to get the top 10 best runs on anything. Use `>ki help top` to understand how to use arguments with that command. If arguments are omitted, the bot will instead get the best runs of what was last shown in that discord channel by, for example, someone using `>ki recent`.

## Misc

You can use the first letter of each command instead of typing it in full!

`>ki recent` -> `>ki r` | `>ki user` -> `>ki u` | `>ki compare` -> `>ki c` | `>ki top` -> `>ki t`
