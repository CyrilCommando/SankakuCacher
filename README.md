# SankakuCacher
Chrome extension that does a couple things for chan.sankakucomplex.com

automatically download images sankakucomplex

## SankakuCacher is a browser extension that aims to provide you with rich history and archival options (or, cache if you will) for all images you browse on chan.sankakucomplex.com, plus some QoL improvements.

# Features:

#### Hold click on a thumbnail to bring up a preview.
![alt text](https://i.imgur.com/GRgM1Jf.gif)

#### Download buttons above and below content.
![alt text](https://i.imgur.com/uCRQhKT.gif)

#### Automatically favorite images you choose to download.
![alt text](https://i.imgur.com/6clAxCs.gif)

#### Favorite/Unfavorite images with a middle click
![alt text](https://i.imgur.com/IttuyK6.gif)

#### Automatically download images you open.
![alt text](https://i.imgur.com/oPnb08O.gif)

#### Options menu with detailed control of all options
![alt text](https://i.imgur.com/h1kks3p.gif)

#### History menu with image expansion, search bar, download buttons, & open in new tab buttons
![alt text](https://i.imgur.com/BRJqMb7.gif)

#### Mass-download function to download many in a group of tags at once!
![alt text](https://i.imgur.com/10yKJm2.gif)

## How to use SankakuCacher?
You'll need to download a full zip of the source code from the master branch or a release in the releases tab.
Extract the "SankakuCacher1.X" folder somewhere on your computer.
Enable "developer mode" in the top right of Chrome's or Edge's extensions menu.
Click "Load unpacked" in the top left.
Select the SankakuCacher folder you just extracted.
And pin the extension!

To use mass download - in popup or settings type the tags you want to download & press Download Tags. The window where the request was initiated must stay open, which is sometimes hard to do for popup so settings is recommended.
Tags are separated by spaces like the site, so for example: 
fav:cyrilcommando genshin_impact -animated

limit is how many to download, concurrent is how many can be downloaded simultaneously at once, and offset is where to begin in the selected tags. To start at page 2, type 20. To start at page 3, type 40. every page has 20 images. This is inconsistent, pages can sometimes have less than 20 images. If you type offset 20 and the first page doesn't have 20 images, the operation will fail and simply do nothing. This massDL also works for restricted images as long as you're logged in.
