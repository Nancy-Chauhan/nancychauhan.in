---
title:  My Summer with Librecores CI
author: Nancy Chauhan
date:   2019-05-10
hero: ./images/gsoc-0.png
excerpt: This year I have got the opportunity to work with Fossi Foundation as a Google Summer of Code Student Developer 2019. 

---

This year I have got the opportunity to work with Fossi Foundation as a Google Summer of Code Student Developer 2019. 
I will be working on project Continuous Integration for Hardware Projects on LibreCores CI

### Google Summer of Code

Google Summer of Code (GSoC) is a yearly program by Google to help the open source communities to 
reach out to student contributors. Organisations pitch projects, and when selected, pick up university students to work on 
these projects or their own ideas related to the organisation’s project(s).

Librecores provides a platform to share projects and ideas, in the area of free and open source digital hardware design. 
Librecores CI is an approach/service to provide continuous integration to hardware projects hosted on Librecores to 
improve user experience and reliability. 

### Benefits to the community

To streamline project management, reduce risk and improve the quality, we need some form of "automation". 
Although hardware and software development is different in their development and in their delivery processes, 
both practices share common aspects, and in both cases, the objective is to know if,
in the end, we can release a functional product. By working on some hardware projects this summer and creating demo CI flow, 
It will help contributors and developers of  projects in the following way : 

1) The first benefit is that Integrated RTL will be as functional as possible at any time.
This will smooth the overall verification tasks and will also enable clear visibility of what is implemented, functional and 
tested.

2) Continuous integration will be capable of quickly highlighting commits which introduced a functional regression 
(which break the builds).

3) As broken regressions will be visible to anyone in the projects, this will also accelerate the feedback loop, enabling quick communication between the different teams to fix any issues.


### Project Description

This project aims to provide automation service for some hardware projects that 
have a constantly evolving code. Jenkins, the automation server will be used to achieve the goals of the project.
During the GSoC period I aim for the following deliverables:

1) Setup a pull request builder for the repository.

2) Implement a generic framework for automation of the FuseSoC-based projects.

3) Setting up a [mor1kx](https://github.com/openrisc/mor1kx) development and verification environment.Setup of proper environment for all test cases of mor1kx.

4) Implement docker tools and pipeline library for the tools required for the verification of mor1kx
(as a part of the LibreCores CI project).

5) Setup demo CI flow for mor1kx.

For more information contact on : 

[Fossi Foundation Mailing list](https://lists.librecores.org/listinfo/discussion)

[Chat](https://gitter.im/librecores/librecores-ci)

[OpenRisc Mailing List](https://lists.librecores.org/listinfo/OpenRISC)

