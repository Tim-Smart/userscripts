# USO, meet Markdown. One day Userscripts.org used plain HTML for writing comments and guides,
# little did he know about a young lass that called herself Markdown.
# Userscripts.org fell madly in love.

# ==UserScript==  
# @name           USO, meet Markdown.  
# @namespace      http://userscripts.org/users/tim  
# @description    Markdown gets married to Userscript.org  
# @include        http://userscripts.org/topics/*  
# @require        http://userscripts.org/scripts/source/70908.user.js  
# @require        http://userscripts.org/scripts/source/104570.user.js  
# ==/UserScript==

# Some ideas in this script originated from SizzleMcTwizzle's comment fix script: 
# http://userscripts.org/scripts/show/24464
#
# Kudos to him!


#### Post class
# This class represents a post on Userscripts.org, usually found in a topic
class Post
  constructor: (page, element) ->
    @page    = page
    @element = element

    if 'TR' is @element.nodeName
      @initFromTopic()
    else if 'DIV' is @element.nodeName
      @initFromGuide()

  element: null

  # We are currently in a guide, attach listeners, grab post info etc
  # and populate the Post instance with data
  initFromTopic: ->
    authorCont = @element.getElementsByClassName('author')[0]
    nameLink   = authorCont.getElementsByClassName('fn')[0]
                           .getElementsByTagName('a')[0]
    useragent  = authorCont.getElementsByClassName('useragent')[0]
    linkCont   = authorCont.getElementsByTagName('p')[0]

    if not linkCont or useragent isnt linkCont.nextElementSibling
      linkCont = document.createElement 'p'
      authorCont.insertBefore linkCont, useragent

    @id       = /\d+$/.exec(@element.id)[0]
    @userId   = nameLink.getAttribute 'user_id'
    @userName = nameLink.textContent
    @userHref = nameLink.href
    @body     = @element.getElementsByClassName('body')[0].
                    innerHTML

    @belongsToUser = if authorCont.getElementsByClassName('edit')[0]
      true
    else false

    # Insert the quote link
    @insertUtility 'Quote', linkCont, =>
      @quote()

  # Shortcut for inserting a utility link into the post
  # author section. cont is an optional container, to save
  # looking for it again
  insertUtility: (name, cont, callback) ->
    if 'function' is typeof cont
      callback = cont
      cont     = null

    span               = document.createElement 'span'
    span.style.display = 'block'
    span.className     = 'edit'

    link                = document.createElement 'a'
    link.style.fontSize = '12px'
    link.textContent    = name
    link.href           = '#'
    link.className      = 'utility'

    link.addEventListener('click', (event) ->
      event.preventDefault()
      callback event
    , false)
    span.appendChild link

    if not cont
      @element.getElementsByClassName('author')[0].
               getElementsByTagName('p')[0].
               appendChild span
    else
      cont.appendChild span

  # This post function takes either a selection, or the entire post body,
  # then passes it to the editor 'insertQuote' function
  quote: ->
    selection = window.getSelection()
    html      = ''

    if '' is selection.toString()
      html = @body
    else
      range   = selection.getRangeAt(0)
      element = range.commonAncestorContainer
      while element
        if 'TD' is element.nodeName and 0 is element.id.indexOf 'post-body-'
          if 'post-body-' + @id is element.id
            properSelection = true
          break
        element = element.parentNode

      if properSelection
        fragment = range.cloneContents()
        holder   = document.createElement 'div'
        holder.appendChild fragment

        html = holder.innerHTML
        range.detach()

        holder = range = fragment = null
      else html = @body
    page.editor.insertQuote html, @userName, @userId, @id

#### Guide class
# Represents a guide on Userscripts.org
class Guide
  constructor: (page, element) ->
    @page = page

#### Editor class
# Represents the current editor in the page
class Editor
  constructor: (page, element) ->
    @page = page
    @element = element

    if 'DIV' is element.nodeName
      @initFromReply()

  element: null

  # Here we modify the reply box, and over-ride a function on the USO
  # page that gets called on a edit operation
  initFromReply: ->
    oldSetReplyId = unsafeWindow.EditForm.setReplyId

    # Practically this is the 'onPostEdit' listener
    unsafeWindow.EditForm.setReplyId = =>
      oldSetReplyId.apply unsafeWindow.EditForm, arguments

      @element = document.getElementById 'edit'

      @textarea = document.getElementById 'edit_post_body'
      textarea  = @textarea
      @addShortcuts @textarea

    textarea = document.getElementById 'post_body'

    @addShortcuts textarea

    oldReplyInit = unsafeWindow.ReplyForm.init
    unsafeWindow.ReplyForm.init = =>
      oldReplyInit.call unsafeWindow.ReplyForm
      @element  = document.getElementById 'reply'
      @textarea = document.getElementById 'post_body'

    @element = null

  # This function takes html, the User-Name, a User ID and a post ID,
  # converts it to markdown, then inserts the
  # resulting quote into the current textarea
  insertQuote: (html, username, userId, postId) ->
    if @ensureElement()
      previous = markdownToHtml @textarea.value
      modify   = (html) ->
        previous + html

    html = html.replace(/<!--.+-->/, '').trim()
    html = "<blockquote><p><strong><a href='/users/#{userId}'>#{username}</a></strong>" +
           "&nbsp;<a href='#{location.pathname + location.search}#posts-#{postId}'>wrote</a>:</p>#{html}</blockquote>"

    html = modify html if modify
    @textarea.value = htmlToMarkdown html
    this

  # Insert text at the caret position
  insertAtCaret: (text) ->
    start = @textarea.selectionStart
    end   = @textarea.selectionEnd
    if 'number' isnt typeof start or 'number' isnt typeof end
      start = end = @textarea.value.length
    @insertText text, start, end
    this

  # Insert some text at the specified position
  insertText: (text, start, end) ->
    end or= start
    pos = @textarea.selectionStart
    val = @textarea.value
    val = val.slice(0, start) + text + val.slice end
    @textarea.value = val
    if 'number' is typeof pos
      @textarea.selectionStart = @textarea.selectionEnd = pos + text.length
    this

  # This is used by the insertQuote function to see whether we are currently
  # in a reply or not. If we are not in a reply, it will open a reply box. If
  # we are in a edit or reply, it just returns true
  ensureElement: ->
    if not @element
      @openReply()
      false
    else if 'none' is @element.style.display
      @openReply()
      false
    else
      true

  # Opens the reply box, simple.
  openReply: ->
    unsafeWindow.ReplyForm.init()

  # Adds the following keyboard shortcuts
  # TODO : Fix scrolling when enter is pressed.
  #
  # * Tab to 2 spaces
  # * Enter for indented new line
  #
  addShortcuts: (textarea) ->
    editor = this
    textarea.addEventListener 'keydown', (event) ->
      switch event.keyCode
        when 9
          event.preventDefault()
          editor.insertAtCaret '  '
        when 13
          event.preventDefault()
          editor.newline()
    , false

  # Most likely the enter key was pressed.
  #
  # Properly create indentation on the next line
  newline: ->
    pos = @textarea.selectionStart
    if pos < 1
      return @insertAtCaret '\n'

    last_line = (@textarea.value.slice 0, pos).lastIndexOf '\n'
    indent = /^(?:\s|>)*/.exec(@textarea.value.slice last_line + 1, pos)
    @insertAtCaret '\n' + indent


#### Page class
# Represents a page on USO, depending on the URI. It will add all
# the necessary listeners, insert all the elements, construct all the posts,
# the guide if necessary, and generally all the other stuff I missed
class Page
  init: ->
    path = location.pathname

    if 0 is path.indexOf '/topics'
      @initFromTopic()

  comments: []
  editor:   null
  title:    document.title

  # Set-up page from a standard topic.
  initFromTopic: ->
    postElements = document.getElementsByClassName 'post'

    @editor = new Editor @, document.getElementById 'reply'

    for post in postElements
      @comments.push new Post @, post

    @title = document.getElementById('topic-title').firstChild.
                      textContent.trim().replace /\s+/g, ' '


#### Parsing functions

# A instance of showdown
showdown = new Showdown.converter()

# Takes a string of html, and parses it to markdown using
# dom2markdown
htmlToMarkdown = (html, callback) ->
  div           = document.createElement 'div'
  div.innerHTML = html
  USO.dom2markdown div

# Takes a string of markdown, and parses it to html
markdownToHtml = (markdown) ->
  showdown.makeHtml markdown

# Finally start setting up page
page = new Page()
page.init()

