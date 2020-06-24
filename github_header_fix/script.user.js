// ==UserScript==
// @name        Github Header Fix
// @namespace   https://github.com/tim-smart
// @match       https://github.com/*
// @author      Tim Smart
// @copyright   2020 Tim Smart
// @license     MIT
// @grant       none
// ==/UserScript==
// Copyright © 2020 Tim Smart
// Permission is hereby granted, free of charge, to any person obtaining
// a copy of this software and associated documentation files (the "Software"),
// to deal in the Software without restriction, including without limitation
// the rights to use, copy, modify, merge, publish, distribute, sublicense,
// and/or sell copies of the Software, and to permit persons to whom the
// Software is furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
// OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
// IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
// TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE
// OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
(function () {
  const head = document.querySelector(".repohead");
  if (!head) return;
  const nav = head.querySelector(".UnderlineNav-body");
  if (!nav) return;
  nav.style.marginLeft = "auto";
  nav.style.marginRight = "auto";
  nav.style.maxWidth = "1216px";
  nav.style.width = "100%";
  const links = head.querySelector(".d-flex");
  if (!links) return;
  links.style.marginLeft = "auto";
  links.style.marginRight = "auto";
  links.style.maxWidth = "1280px";
})();
