# SankakuCacher
Chrome extension that does a couple things for chan.sankakucomplex.com

automatically download images sankakucomplex

## SankakuCacher is a browser extension that provides you with rich history and download options for all images you browse on chan.sankakucomplex.com. <br> Its main feature is a batch/mass download function to download many posts in a group of tags at once from Sankaku.

If you'd like to support my work, I made a ko-fi. Any donations are appreciated. <br><br>
[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/P5P11NN58X)

# New in 3.0:

#### Improved popup menu.
![alt text](https://i.imgur.com/dVimzgW.gif)

#### New settings menu
![alt text](https://i.imgur.com/3hZ8nE0.gif)

#### Really sweet new redesign for the downloader. 
![alt text](https://i.imgur.com/F4jNOQ8.gif)

#### History menu redesign
![alt text](https://i.imgur.com/FPYGFXz.gif)

#### Actual filename controls..
Yeah, I know.. Should've been in in the first version probably..
Now, images downloaded with 'include date' enabled can be sorted as "name" in Windows and it will sort by date uploaded to Sankaku.

![alt text](https://i.imgur.com/3RPYQVs.png)

## Fun browser problems
So as it turns out Firefox & Chrome are total messes. Downloading full videos & gifs in history menu doesn't work in firefox if the file is larger than 32mb due to an extremely obscure issue where the IPC message size is limited to 32mb. (This actually doesn't apply anymore since I use IndexedDB now to save the images, but it's still true for the localstorage API!) <br>
Also, the "include character" & whatnot settings will sometimes fail a download because of some kind of character limitation that's dependent on the final total pathname of the file. it appears it can't exceed 255-260 characters /including/ the folder path, so there's no 100% consistent way from the browser to actually make sure everything's downloaded properly.. Kinda like, period actually. Some people talk about download failures of files with long names on Microsoft forums or other places and well, if you include character names & other stuff the filename becomes long. Too long for the browser. What I did was settle on a maximum of 3 character tags in a filename, but even that can still mess up depending on how many tags you select to use. To be safe you could just use the regular name & date. But honestly, even that could theoretically fail if your folder name is long enough.  

## Chrome?..

& Also I totally forgot that I stopped using Chrome like a year ago and this was originally a chrome extension. Chrome version will still be supported but Chrome was dead to me after the changes they've made in the last year and a bit.

# Features:

#### Download buttons above and below content.
![alt text](https://i.imgur.com/uCRQhKT.gif)

#### Automatically download images you open.
![alt text](https://i.imgur.com/oPnb08O.gif)

#### Automatically favorite images you choose to download. 
![alt text](https://i.imgur.com/6clAxCs.gif)

#### History menu with image expansion, search bar, download buttons, & open in new tab buttons
![alt text](https://i.imgur.com/FPYGFXz.gif)

# Dropped features

Unfortunately Sankaku keeps breaking everything, & I've got limited patience to deal with it.

#### Hold click on a thumbnail to bring up a preview. (gone)
![alt text](https://i.imgur.com/GRgM1Jf.gif)

#### Favorite/Unfavorite images with a middle click (broken)
![alt text](https://i.imgur.com/IttuyK6.gif)

## Browser Recommendation
Use Waterfox. It's the only good browser on the market right now. You can install extensions easily and permanently on that browser.

## How to use SankakuCacher?
I recommend downloading a full zip from the releases tab. I've switched to date versioning so we know when it was actually published (and therefore its chance of working) instead of meaningless numbers.

#### Chrome/Edge
Extract the folder somewhere on your computer. <br>
Enable "developer mode" in the top right of the extensions menu. <br>
Click "Load unpacked" in the top left. <br>
Select the SankakuCacher folder you just extracted. <br>
Pin the extension (for convenience). <br>

#### Waterfox
Waterfox can just load the zip. Use Waterfox!!!1

#### Firefox
Good luck.

## Mass Download instructions
The window where the download was started must stay open.
Enter tags just like you would the site. So for example <br>
fav:cyrilcommando genshin_impact -animated <br>
would download all the posts that match that tag combination. <br>
limit is how many to download, concurrent is how many can be downloaded simultaneously at once, and offset is where to begin in the selected tags. To start at page 2, type 25. To start at page 3, type 50. every page has 25 images. (This changes frequently, blame Sankaku. They can barely keep it running in the first place. I'll try to update the extension ASAP when a per-page number change occurs. It may even be different for different account types, god knows.) <br>
This works for restricted images too, if you're logged in.
