# 6561 - a base 3 version of 2048

## Description
A twist on 2048, using powers of 3 instead! Was originally going to be called 3^11 since 2048 is 2^11, but it turns out that 177,147 isn't anywhere near as catchy. Currently terminal only

## Features
- Able to run base 2048
- On higher base values, uses the same logic scaled up for the relevant base (e.g. three identical numbers need to be merged for the next power of 3)
- To help with base 3 mode onward, an optional toggle to combine three adjacent identical numbers whenever merges/new numbers are added centred on the middle element, e.g.
```
.  3  9     .  .  9    .  .  .
3  3  9  -> .  9  9 -> .  . 27
.  .  .     .  .  .    .  .  .
```
- Scaled to be able to implement the same features for standard base 2 2048, and also for base 4 and 5 versions of the game

## Planned features
- A menu of choices at the beginning to decide game parameters
- The option to save score and game progress for later, and high score for each game setting
- A non-terminal visualisation of the game

## Installation and technologies
Written in Python 3.11. No other technologies required at present

## License
Copyright 2024 Aiden Tsen. Licensed under the Educational Community License, Version 2.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at [http://www.osedu.org/licenses/ECL-2.0](http://www.osedu.org/licenses/ECL-2.0). Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an “AS IS” BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
