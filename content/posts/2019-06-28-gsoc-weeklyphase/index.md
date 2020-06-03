---
title:  Coding Phase 1 - Week 3 & 4
author: Nancy Chauhan
date:   2019-06-28
hero: ./images/code.png
excerpt: Coding Phase 1 - Week 3 & 4 (GSoC 2020)

---

So the first phase is about to end. In the last post I talked about 
[Modifying mor1k Travis CI flow to use Librecores-CI image.](http://nancychauhan.in/stories/2019/06/08/gsoc-week1_2/)
There have been some changes this week and some efforts to achieve some new deliverables.

Previously I worked on modifying mor1kx Travis CI flow to use Librecores-CI image, and this week I worked on [or1k_marocchino](https://github.com/openrisc/or1k_marocchino) OpenRISC processor IP core based on Tomasulo algorithm.
It had a very similar Travis file as that of mor1kx, so it was easy for me to adopt changes in this repository to use Librecores-CI image, 
as mentioned in my previous blog. With this work now the or1k Continuous Integration (CI) suite in openrisc projects: mor1kx and or1k_marocchino are running
in a Librecores-CI docker container in Travis CI. Parallel execution of tests runs in Librecores-CI docker environment.

It was also observed that [test.sh](https://github.com/openrisc/or1k_marocchino/blob/master/.travis/test.sh#L10) downloads and installs the or1k toolchain and check for every stage in parallel execution. So it made a sense to create a docker image for openrisc based on the standard librecores/librecores-ci image, that targets specific tools used by openrisc Projects. 
[https://github.com/librecores/docker-images/pull/20](https://github.com/librecores/docker-images/pull/20)

The other deliverable of the project was to create Jenkinsfile for the mor1kx project so that it can be added to [ci.librecores.org](https://ci.librecores.org/) so that Pull request builder runs for the repository. I have created [Jenkinsfile](https://github.com/openrisc/mor1kx/pull/84) in mor1kx repository. 
It will be updated later once Declarative Pipeline of Jenkins gets the required features(matrix feature). Currently, I have 
used `Parallel stages with Declarative Pipeline` to adopt parallel execution of tests : 

```
stage("Docker run") {
    parallel {
        stage("verilator") {
            environment {
                JOB = 'verilator'
            }
            steps {
                dockerrun()
            }
        }
        stage("testing 1") {
            environment {
                JOB = 'or1k-tests'
                SIM = 'icarus'
                PIPELINE = 'CAPPUCCINO'
                EXPECTED_FAILURES = "or1k-cy"
            }
            steps {
                dockerrun()
            }
        }
    }
}
  ```

 ### Pull Request Merged :

 1) [Run tests inside librecores CI docker image in or1k_marocchino](https://github.com/openrisc/or1k_marocchino/pull/10)

 2) [Add license and user documentation for the LibreCores CI build image](https://github.com/librecores/docker-images/pull/16)

### Work on Progress:

1) [Rework on docker image](https://github.com/librecores/docker-images/pull/20)  

2) [Create Jenkinsfile](https://github.com/openrisc/mor1kx)

### What lies ahead?

Next, I intend to Create CI for yosys synthesis [http://www.clifford.at/yosys/](http://www.clifford.at/yosys/) for monitoring resource usages in mor1kx, 
further extending it to support pnr, i.e., place and route. Also, expect to create CI OpenOCD/GDB for CPU pipeline debugging in upcoming weeks.

