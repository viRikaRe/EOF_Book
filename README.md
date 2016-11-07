# EOF_Showcase 

This project utilizes [W2UI](https://github.com/vitmalina/w2ui).

## How to use
1. Clone it on local machine, then open ```index.htm```. No local server needed.
2. You may change ```img_dir``` in ```script/script.js``` to your own image directory.
3. Scripts are intentionally loaded synchronously, because this project is designed to be opened directly from local machine. Modern browsers impose CORS restrictions, so functions like ```$.getScript()``` will fail.
