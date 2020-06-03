---
title:  Running a JVM inside a container
author: Nancy Chauhan
date:   2018-12-26
hero: ./images/jvmdocker.png
excerpt: Running the JVM in a container presented problems with memory and cpu sizing and usage that led to performance loss.
---

Many applications that run in a Java Virtual Machine (JVM),are run in containers. But running the JVM in a container presented problems with memory and cpu sizing and usage that led to performance loss. It might kill the other images 

This happened because Java didn't recognize that it was running in a container . Containers are made possible by using Kernal features of the operating system, one of which is called cgroups, which isolates the resource usage (CPU, memory, disk I/O) of the containers. 

But not all things know about cgroups, which can lead to strange results 

But Both memory and cpu constraints can be used manage Java applications directly in containers, these include:

    adhering to memory limits set in the container
    setting available cpus in the container
    setting cpu constraints in the container

The JVM, prior to JDK10, is unaware of cgroups. So ergonomic calculations are not based on the limits for the container

To fix this we need to set the JVM max heap size, but I’m still not inclined to want to explicitly set these. Ideally, the JVM would still provide sensible defaults. And as it turns out the JVM has some additional flags which allow it to do this.

```
-XX:+UnlockExperimentalVMOptions -XX:+UseCGroupMemoryLimitForHeap
```


 A very good Reference : https://developers.redhat.com/blog/2017/04/04/openjdk-and-containers/

    


