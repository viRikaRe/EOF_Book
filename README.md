# EOF_Book

## How to use
1. Clone it on local machine, then open ```main.htm```. No local server needed.
2. You may change ```img_dir``` to your own image directory. You may also change ```img_name_style``` in ```script/script.js``` to match your image name style.
3. Scripts are intentionally loaded synchronously, because this project is designed to be opened directly from local machine. Modern browsers impose CORS restrictions, so functions like ```$.getScript()``` will fail.

## Caution
This project is designed to be opened from local PC -- NO security method is implemented. So do NOT run it on public server.

## This project utilizes... 
* [W2UI](https://github.com/vitmalina/w2ui)
* [FontAwesome](https://github.com/FortAwesome/Font-Awesome)
