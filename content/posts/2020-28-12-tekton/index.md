---
title:  Adopting Tekton — Cloud Native CI Solution
author:  Nancy Chauhan
date:   2020-12-28
hero: ./images/tekton.jpg
excerpt: I have been exploring Tekton as a CI platform recently for my office and off-office work. So I thought to share all my findings with you.

---

I have been exploring Tekton as a CI platform recently for my office and off-office work. So I thought to share all my findings with you.
Tekton is a powerful yet flexible, Kubernetes-native open-source framework for creating continuous integration and continuous delivery (CI/CD) systems. But before we proceed, let’s see what exactly Cloud Native CI/CD is?
What is cloud-native CI/ CD?

![What is Cloud Native ?](https://miro.medium.com/max/886/1*VZL7q-tRTDEQ4j-MbDminQ.png)

Recently we have encountered a DevOps culture shift with cloud-native architectures in software development. Cloud-Native is a new approach to build and run applications. In short, we can say the most popular way to go Cloud-Native consists of Containers + Kubernetes.

With the rise of containerization, both build and deployment stages in CI/CD pipelines continue to be containerized. It has led to the rise and development of various CI and CD tools for the Cloud-Native landscape.

## Kubernetes and CI/CD

While running CI/CD pipelines in Kubernetes, some of the challenges we are going to face are:

* Images instead of binaries
* Clusters: Many environments
* Microservices instead of monoliths (Managing dependencies between all services is going to be challenging)
* Ephemeral environments.

Hence, we need a solution to these challenges in the form of cloud-native CI/CD tools. Some of the tools listed in the cloud-native landscape are Spinnaker, Argo CD, Tekton, and Jenkins X. Let’s take a deep dive into Tekton now!

# Tekton

Tekton provides us with composable, declarative, reproducible, and Cloud-Native tools to easily build the pipelines. Tekton adds a few CRDs and custom resources to your Kubernetes cluster which can be used to make CI/CD pipelines.

## Tekton Building Blocks

![Step, Task, Pipeline](https://miro.medium.com/max/1356/1*SqHHsH7dTGNEVd6zTD_-XA.png)

**Step**: Step is a container spec (k8s type), the most fundamental building block in Tekton. For instance, running unit tests of application would be a step.

**Task**: Task is a sequence of steps, runs in sequential order, and most importantly, it runs on the same K8s node, which allows you to have the same environment. For instance, if you mount a volume in a task, it would be shared across each step.

**Pipeline**: Pipeline is a collection of Tasks that can be run in different ways ( sequentially, concurrently, or a DAG). You can also provide the output of one task to another task even if it runs on a different K8s node.

## To invoke these we have :

![PipelineRun and TaskRun](https://miro.medium.com/max/1086/1*e5yv4QARvrGgqG7xkkdfSw.png)

### *Instances of Pipeline/Task*:

* **PipelineRun**: It is a specific execution of a pipeline that contains runtime data such as parameters and results.
* **TaskRun**: It is a specific execution of a task with runtime data.

PipelineRun and TaskRun bind together your tasks and pipelines with the parameter values and data. They can be triggered manually or on-demand using Tekton triggers.

In this blog, we will see how to trigger a pipeline manually. Later in the next blog, I will give an example to trigger pipeline automatically with webhook configuration. Let’s get started!

# How to get started?

**Prerequisites** :

* Kubernetes cluster to test out the changes. Install [Kind](https://kind.sigs.k8s.io/docs/user/quick-start/#installation) to create a cluster locally.
* Install Tekton on the cluster :

This will Install Tekton in a new namespace called `tekton-pipelines` :

```
kubectl apply --filename https://storage.googleapis.com/tekton-releases/pipeline/latest/release.yaml
```

To switch to `tekton-pipelines` namespace where Tekton components are installed use this :

```
kubectl config set-context --current --namespace=tekton-pipelines
```
* Install [Tekton Dashboard](https://tekton.dev/docs/dashboard/) .

*  After installation, set up port forwarding with Tekton Dashboard:

```
kubectl --namespace tekton-pipelines port-forward svc/tekton-dashboard 9097:9097 
```

* Set up a container registry. If you do not have one, you can set up a Github container registry by referring to [https://nancychauhan.in/github-container-registry](https://nancychauhan.in/github-container-registry/)

# Setting up

### Install tasks from Tekton Hub

Install tasks on your Kubernetes namespace. We will use them to build the pipeline later.

* [git-clone](https://hub-preview.tekton.dev/detail/34)
```
kubectl apply -f https://raw.githubusercontent.com/tektoncd/catalog/master/task/git-clone/0.2/git-clone.yaml
```
* [kaniko](https://hub-preview.tekton.dev/detail/55)
```
kubectl apply -f https://raw.githubusercontent.com/tektoncd/catalog/master/task/kaniko/0.1/kaniko.yaml
```

### Create a secret for the service account
It will provide the credentials for pushing the docker image we build in the pipeline later.

```
 kubectl create secret docker-registry ghcr --docker-username=$USERNAME --docker-password=$TOKEN --docker-server="https://ghcr.io/v1/"
 ```

 ### Apply Tekton manifests

 We will set up CI for a sample project: [https://github.com/Nancy-Chauhan/keystore](https://github.com/Nancy-Chauhan/keystore)

This pipeline will run the tests, build a docker image, and push it to the registry we configured.

* Create a service account that allows access to the secrets we just created:

```.*yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: tekton-ci
secrets:
  - name: ghcr
```

```
kubectl apply -f https://gist.githubusercontent.com/Nancy-Chauhan/a81c3088ff5a446fab026a20fecc20ad/raw/dfd0475c5e1cc0513547f9144e4108b8eeb6f2b0/tekton-ci.yaml
```
* Create a pipeline to run tests and build & push a docker image:

```.*yaml
apiVersion: tekton.dev/v1beta1
kind: Pipeline
metadata:
  name: ci
spec:
  params:
    - name: git-revision
      type: string
    - name: git-url
      type: string
    - name: image
      type: string
  workspaces:
    - name: source
  tasks:
    - name: git-clone
      taskRef:
        name: git-clone
      workspaces:
        - name: output
          workspace: source
      params:
        - name: revision
          value: $(params.git-revision)
        - name: url
          value: $(params.git-url)
    - name: build-and-push
      runAfter: ["git-clone"]
      taskRef:
        name: kaniko
      workspaces:
        - name: source
          workspace: source
      params:
        - name: IMAGE
          value: $(params.image)
```

```
kubectl apply -f https://gist.githubusercontent.com/Nancy-Chauhan/d173a53761458b82a858274e8335a163/raw/8219e12ee894ab2c4645f5f593b4641cb8e7e3df/pipeline.yaml
```

# Run the pipeline

Create a PipelineRun to trigger the pipeline, and you can pass information about the build.

Use the below example to create a PipelineRun. Replace the value of the image to refer to your registry and other parameters as necessary.

```.*yaml
apiVersion: tekton.dev/v1beta1
kind: PipelineRun
metadata:
  generateName: keystore-ci-
spec:
  pipelineRef:
    name: ci
  serviceAccountName: tekton-ci
  params:
    - name: git-revision
      value: master
    - name: git-url
      value: https://github.com/Nancy-Chauhan/keystore.git
    - name: image
      value: ghcr.io/nancy-chauhan/keystore:latest
    - name: repo-name
      value: Nancy-Chauhan/keystore
    - name: git-commit-sha
      value: 0d4b1935a9eddd1b3ecc8e921901aa34dfa703e6
  workspaces:
    - name: source
      volumeClaimTemplate:
        spec:
          accessModes:
            - ReadWriteOnce
          resources:
            requests:
              storage: 5Gi
```

```
kubectl create -f keystore-ci.yaml
```

You can see the status of the pipeline in the Tekton Dashboard:

![Tekton Dashboard](https://miro.medium.com/max/1400/1*yz6OAvXVk2IxJTt6OhOyvw.png)

When the pipeline completes successfully, it posts success status for the commit.

![Passing Github status check](https://miro.medium.com/max/1400/1*wCpaUVlxUnZa8kWUPRtVEA.png)

### *Limitations*:

We currently only update the success status as Tekton does not provide completion status to tasks yet. There are workarounds like writing status to a file and using it to send status to Github, but it is a story for another time. If you are interested in tracking the progress, check this:

[https://github.com/tektoncd/pipeline/issues/3645](https://github.com/tektoncd/pipeline/issues/3645)

### Advantages of using Tekton:
* Tekton is cloud-native, runs on an existing Kubernetes cluster.
* Tekton provides an out-of-the-box solution for monitoring.
Easy to build pipeline using reusable tasks and steps.

### Disadvantages :
* No out-of-the-box support for authentication.
* Pipeline configuration is stored separately from code. To change the pipeline configuration, developers need to apply Kubernetes manifests manually.

Tekton community is quite helpful and quite prompt to reply to all your queries. Check it here: [https://github.com/tektoncd/community/blob/master/contact.md](https://github.com/tektoncd/community/blob/master/contact.md)

References: [https://www.youtube.com/watch?v=sUkvpzr9du8](https://www.youtube.com/watch?v=sUkvpzr9du8)

In the next blog, I will discuss setting up a webhook to automatically trigger the pipeline and monitor Tekton.

Originally Posted at [https://medium.com/@_nancychauhan/adopting-tekton-cloud-native-ci-solution-67fb229f4992](https://medium.com/@_nancychauhan/adopting-tekton-cloud-native-ci-solution-67fb229f4992 ) 
