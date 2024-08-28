# 6561 - a base 3 version of 2048

## Description
A twist on 2048, using powers of 3 instead! Was originally going to be called 3<sup>11</sup> since 2048 is 2<sup>11</sup>, but it turns out that 177,147 isn't anywhere near as catchy

Originally made as a Python exercise, still present [here](https://github.com/aidentsen/6561/blob/main/terminal_version.py). Now has a GitHub Pages version implemented [here](https://aidentsen.github.io/6561/) in JavaScript, HTML and CSS

## Features

Core features
- Classic 2048 gameplay, but with base 3 instead
- To fit with base 3, now to merge values, you need to merge three in a row/column
- To help with the increased strictness, three adjacent identical numbers are merged together at the end of each turn after the new tile is added as below:
```
.  3  9     .  .  9    .  .  .
3  3  9  -> .  9  9 -> .  . 27
.  .  .     .  .  .    .  .  .
```
- A new game can be started without reloading the webpage

Quality of life
- CSS transitions for tiles that are moved, merged or added
- Merges and new tile additions are staggered with a sleep function so you can see them happen
- In-progress games can be exported as a JSON file for later...
- ...and then re-imported and validated to continue!
- Text indicator for game over or invalid JSON file passed

## Potential additional GitHub Pages additions
- Mobile functionality (due to the event listener working with keypresses, it isn't currently playable on mobile)
- Basic CSS touch-up (primarily buttons and text)
- CSS responsive design

## Installation and technologies
GitHub Pages version uses ES6 JavaScript, HTML and CSS, should require no installations

Python code written in Python 3.11. No other technologies required at present

## License
Copyright 2024 Aiden Tsen. Licensed under the Educational Community License, Version 2.0 (the “License”); you may not use this file except in compliance with the License. You may obtain a copy of the License at [https://www.osedu.org/licenses/ECL-2.0](https://www.osedu.org/licenses/ECL-2.0). Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an “AS IS” BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
