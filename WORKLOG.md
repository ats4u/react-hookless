
    Worklog
=============================


Fri, 11 Aug 2023 12:02:09 +0900
------------------------------------
There was a problem with Babel not compiling JSX in `node_modules` in my
Create-React-App environment.

In the source code, there were only three lines that used JSX, and since it was
much easier to compile the JSX manually than to figure out how to configure
Babel correctly, I modified the process so that it could be done without using
Babel.

