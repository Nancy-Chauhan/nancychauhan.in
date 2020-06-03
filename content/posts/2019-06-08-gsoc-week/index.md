---
title:  Coding Phase 1 - Week 1 & 2 
author: Nancy Chauhan
date:   2019-06-08
hero: ./images/codecat.png
excerpt: Coding Phase 1 - Week 1 & 2 (GSoC 2020)

---

It has been almost two weeks since coding phase 1 has started and things are getting clearer with every discussion I have with my mentors Oleg Nenashev and Stafford Horne on 
Setting up demo CI flow for mor1kx.
Till now I have worked on modifying mor1kx Travis CI flow to use Librecores-CI docker image.

### Background : Librecores CI and mor1kx

[Librecores CI](https://github.com/librecores/librecores-ci) is an approach/service to provide continuous integration to hardware projects hosted on Librecores to improve user experience and reliability and [mor1kx](https://github.com/openrisc/mor1kx) is an OpenRISC processor IP core . 
So my first phase mainly consists of working on the mor1kx project.

In mor1kx project [Travis CI flow](https://github.com/openrisc/mor1kx/commit/84b96767c0ccc2a0004c5e0a47626a6657b78021) was already implemented in which mor1kx pipelines are constantly verified for correctness . 
This covers:

1) source linting — a verilator --lint-only check is run on each commit to ensure there are no code quality issues.
        
2) [or1k-tests](https://github.com/openrisc/or1k-tests) — the or1k-tests test suite is run against each pipeline to check most major instructions, exception handling, caching, timers, interrupts and other features.

My main work was to use [Librecores-CI docker image](https://github.com/librecores/docker-images/tree/master/librecores-ci) in mor1kx Travis CI Flow as the flow includes installation of many EDA tools that had already been included in Librecores-CI base image such as : 

    FuseSoC
    Icarus Verilog
    Verilator
    Yosys
    cocotb
    pytest
    tap.py

### Implementation Details

In general, Docker containers are ephemeral, running just as long as it takes for the command issued in the container to complete.
By default, any data created inside the container is only available from within the container and only while the container 
is running.

And so I created test.sh and used docker concept of volumes to persist data of test.sh in librecores-ci container. 
This approach let mor1kx tests to run within the environment of librecores-ci. 
I also worked on implementing parallel execution of tests in my newly created changes that use Librecores CI docker image. 
I used environment variables and travis stages to implement parallel execution : 

    docker run — rm -v $(pwd):/src -e “JOB=$JOB” -e “SIM=$SIM” -e “PIPELINE=$PIPELINE” -e “EXPECTED_FAILURES=$EXPECTED_FAILURES” -e “EXTRA_CORE_ARGS=$EXTRA_CORE_ARGS” librecores/librecores-ci /src/.travis/test.sh

I also modified and updated Librecores CI docker image for its compatibility with mor1kx project

### Pull Request Merged :

 1) [Run tests inside librecores CI docker image]( https://github.com/openrisc/mor1kx/pull/82)

 2) [Updating the Librecores CI Docker image for Compatibility with mor1kx](https://github.com/librecores/docker-images/pull/12)


### Whats Next?

Next, I intend to modify Travis CI Flow of [or1k_marocchino core](https://github.com/openrisc/or1k_marocchino?files=1) to use Librecores-CI image and also creating Jenkinsfile for Librecores-CI in mor1kx that uses the same flow as in Travis.
