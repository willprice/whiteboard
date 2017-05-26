# TODO

## Features

### Saving a new whiteboard

> As a user
> I want to save my current whiteboard
> So that I can revisit it later

User journey:

* Log in
* Redirected to whiteboard
* Start drawing
* Click save on sidebar
* Save dialog appears
* Specify name: "My first drawing"
* Specify tags: "test", "play"
* Click save on dialog
* Dialog disappears
* Click on gallery
* Thumbnail of the whiteboard appears with name underneath

Implementation flow:

* Client: Open a new whiteboard creating a new WhiteboardSession
* Client: Initialise WS connection to server
* Server: Create new WhiteboardWSController for session
* Server: Create new WhiteboardEditSession
* Client: Add some lines
* Client: Click save in sidebar With name "My first drawing" and tags "test" and "play" click save on dialog
* Client: Send name, tags and paths to server
* Server: Receive name, tags and paths
* Server: Add new board with name and tags, add paths
* Client: Click gallery in sidebar
* Client: Dropdown appears with spinner
* Client: Request all whiteboards
* Client: Show list of boards in dropdown, hyperlink them so that clicking on one loads it into the WhiteboardSession

### Starting a new whiteboard

> As a user
> I want to start a new whiteboard
> So that I have another space to work on other than my current board

User journey:

* Starting in whiteboard app
* Click "New" in sidebar
* Canvas is cleared

### Working on a saved whiteboard

> As a user
> I want to retrieve a previous whiteboard
> So that I can continue work on it

User journey:

* Starting in whiteboard app
* Click on "Gallery" in sidebar
* A drop down appears with thumbnails of previous whiteboards, at the bottom is row of tags

### Shared work on a whiteboard

### Exporting a drawing

### Tutorial

> As a user
> I want to be shown how to use the whiteboard tool
> So that I understand the features and limitations of the tool

## Misc

### Logo

* Inkscape
* Take screenshots during production

### Report

*

