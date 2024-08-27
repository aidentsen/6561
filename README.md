# 6561 - a base 3 version of 2048

## Description
A twist on 2048, using powers of 3 instead! Was originally going to be called 3^11 since 2048 is 2^11, but it turns out that 177,147 isn't anywhere near as catchy

Originally made as a Python exercise, still present here. Now has a GitHub Pages version implemented [here](https://aidentsen.github.io/6561/) in JavaScript, HTML and CSS

## Features
- To fit with base 3, now to merge values, you need to merge three in a row/column
- To help with the increased strictness, three adjacent identical numbers are merged together at the end of each turn after the new tile is added as below:
```
.  3  9     .  .  9    .  .  .
3  3  9  -> .  9  9 -> .  . 27
.  .  .     .  .  .    .  .  .
```
- CSS transitions for tiles being merged or added
- Merges etc are staggered with a sleep function so you can see them happen

## Potential additional GitHub Pages features
- Option to reset game from the webpage without 
- Popup window saying game over
- Mobile functionality (due to the event listener working with keypresses, it isn't currently playable on mobile)
- The option to export score and game progress as a JSON file for later (perhaps implemented with hashing to make cheating a tiny bit less trivial)
- Corresponding option to import score and game progress from previously
- Merge chain count and multiplier?

## Installation and technologies
GitHub Pages version uses ES6 JavaScript, HTML and CSS, should require no installations

Python code written in Python 3.11. No other technologies required at present

## License
Copyright 2024 Aiden Tsen. Licensed under the Educational Community License, Version 2.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at [https://www.osedu.org/licenses/ECL-2.0](https://www.osedu.org/licenses/ECL-2.0). Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an “AS IS” BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
