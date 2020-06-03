---
title:  Linux chmod Command
author: Nancy Chauhan
date:   2018-11-04
hero: ./images/chmod.png
excerpt: chmod is used to change the permissions of files or directories.

---

## chmod

chmod is used to change the permissions of files or directories.
On Linux and other Unix-like operating systems, there is a set of rules for each file which defines who can access that file, and how they can access it. These rules are called file permissions or file modes. The command name chmod stands for "change mode", and it is used to define the way a file can be accessed.
In general, chmod commands take the form:
chmod options permissions file name

Let's say you are the owner of a file named myfile, and you want to set its permissions so that:

    1) the user can read, write, ande xecute it;
    2) members of your group can read ande xecute it; and
    3) others may only read it.

This command will do the trick:
chmod u=rwx,g=rx,o=r myfile

This example uses symbolic permissions notation. The letters u, g, and o stand for "user", "group", and "other". The equals sign ("=") means "set the permissions exactly like this," and the letters "r", "w", and "x" stand for "read", "write", and "execute", respectively. The commas separate the different classes of permissions, and there are no spaces in between them.

Here is the equivalent command using octal permissions notation:

chmod 754 myfile

Here the digits 7, 5, and 4 each individually represent the permissions for the user, group, and others, in that order. Each digit is a combination of the numbers 4, 2, 1, and 0:

    4 stands for "read",
    2 stands for "write",
    1 stands for "execute", and
    0 stands for "no permission."



