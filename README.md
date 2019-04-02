# qt-styles

The repository herein contains all of my QT-4+ stylesheets because theme consistency is amazing.
Or at least that's what I thought until I learned Qt doesn't have a built-in system for managing
stylesheets as system-wide themes. So if I wanted to make that happen, I'd most likely have to
build a plugin to Qt. Or I could make a fork of Qt and add that system in myself with the latter
being the harder to maintain of the two.

Each individual *theme*'s stylesheet will be authored within a container folder bearing the same name as the finalized style. I do plan on authoring styles based on other's theme submissions, for which I will ensure to designate proper credit to the theme's original creators in their respective stylesheet's README file. If any source code is included with a theme I am basing my QT version off of, I may include substantial portions of said source code within mine. If that is the case, I'll include the appropriate open source licensing within the container folder as well and, where applicable, annotations to the external licenses that the copied source applies to.

### Usage

If you want to compile one of these projects you'll need less because
I really like that language. I've included an npm package.json to help you get
going. Just do the usual ```npm install .``` and it will grab your
dependencies for you. For the list of build system parameters type ```npm run-script build -- -h```
in the repository directory. The build system doesn't need any parameters to
operate at the moment, but they definitely come in handy, you should check them out.
That goes especially for other developers looking to fork the repo for modification.
There's a particular parameter I implemented *cough cough*: ```--live```, that may be
of good use to you if you're like me and like seeing the results of your work in
*next to real time.*

The theme's qss files will be put in the dist folder for you to pick up and distribute
as you like.

### Project Status

Each project contained in this container will be in one of these statuses:
 1. ![Status terminated](https://img.shields.io/badge/Status-terminated-darkred.svg)
 2. ![Status on hiatus](https://img.shields.io/badge/Status-hiatus-darkorange.svg)
 3. ![Status idea](https://img.shields.io/badge/Status-idea-darkblue.svg)
 4. ![status WIP](https://img.shields.io/badge/Status-WIP-yellowgreen.svg)
 5. ![Status completed](https://img.shields.io/badge/Status-completed-darkgreen.svg)

### Projects
 * ![status WIP](https://img.shields.io/badge/Status-WIP-yellowgreen.svg) **purplest-inc-qt5**: "Purplest Inc" inspired QT-5 system wide application theme.
