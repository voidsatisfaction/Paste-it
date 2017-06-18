# Paste-it

## 1. Abstract

Save some texts for tedious copy and paste on your google chrome storage and reuse any time any where using your chrome browser!!

## 2. Motivation

When I keep doing copy and paste some texts to my resume for enrolling internships, I thought that this simple repeated working is not productive at all and even makes me boring.

Therefore I just made Paste-it to stay me lazy.

Laziness is good for all Programmer. Isn't it?

## 3. How to implement locally

1. Open Chrome browser
2. Go to left upper `setting menu > more tools > Extensions`
3. Check developer mode on right upper side check box
4. Click `Load unpacked extensions ...`
5. Select Paste-it folder(including all files)
6. That's it!!!

## 4. Used tech stacks

- HTML / CSS
- Vanilla javascript(with redux style)
- Chrome storage sync
- Zenhub

## 5. Architecture

![App's architecture](./architecture.jpg)

This app's core is made up of three parts.

Popup / Background / Content script

### Popup

`file: popup.js`

This part fully control the popup section managing its UI and inner logics.

And, it linked to the Background section sending actions to make background some logics as well.

(It is inspired by redux)

### Background

`file: innerPage.js`

It takes care of app's background logics

### Content script

`file: content_script.js`

This part manipulates isolated DOM causing changing actual DOM.

## 6. For more info

I strongly suggest that those who have interests in this project should read this document first.

- [Whar are extesnions? - chrome developer](https://developer.chrome.com/extensions)

Thank you