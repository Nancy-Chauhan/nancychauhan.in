---
title:  Building a Prometheus Exporter
author:  Nancy Chauhan
date:   2021-05-04
hero: ./images/cover.jpeg
excerpt: Prometheus exporters bridge the gap between Prometheus and applications that don’t export metrics in the Prometheus format.

---

[Prometheus](https://prometheus.io/docs/introduction/overview/) is an open-source monitoring tool for collecting metrics from your application and infrastructure. As one of the foundations of the cloud-native environment, Prometheus has become the de-facto standard for visibility in the cloud-native landscape.

# How Prometheus Works?

Prometheus is a [time-series database](https://www.influxdata.com/time-series-database/) and a pull-based monitoring system. It periodically scrapes HTTP endpoints (targets) to retrieve metrics. It can monitor targets such as servers, databases, standalone virtual machines, etc.
Prometheus read metrics exposed by target using a simple [text-based](https://prometheus.io/docs/instrumenting/exposition_formats/#text-based-format) exposition format. There are client libraries that help your application to expose metrics in Prometheus format.

![How Prometheus Works?](https://miro.medium.com/max/1400/1*UhSRulXaVEDoQQRL4nPu6g.png)

# Prometheus Metrics

While working with Prometheus it is important to know about Prometheus metrics. These are the four types of metrics that will help in instrumenting your application:

- Counter (the only way is up): Use counters for counting events, jobs, money, HTTP request, etc. where a cumulative value is useful.
- Gauges (the current picture): Use where the current value is important — CPU, RAM, JVM memory usage, queue levels, etc.
- Histograms (Sampling Observations): Generally use with timings, where an overall picture over a time frame is required — query times, HTTP response times.
- Summaries (client-side quantiles): Similar in spirit to the Histogram, with the difference being that quantiles are calculated on the client-side as well. Use when you start using quantile values frequently with one or more histogram metrics.

# Using Prometheus
- Prometheus provides client libraries that you can use to add instrumentation to your applications.
- The client library exposes your metrics at URLs such as http://localhost:8000/metrics
- Configure the URL as one of the targets in Prometheus. Prometheus will now scrape metrics in periodic intervals. You can use visualization tools such as Grafana to view your metrics or configure alerts using Alertmanager via custom rules defined in configuration files.

# Prometheus Exporters

![Exporter](https://miro.medium.com/max/1400/0*1OpRRb67QvRVg4nx)

Prometheus has a huge ecosystem of [exporters](https://awesomeopensource.com/projects/prometheus-exporter). Prometheus exporters bridge the gap between Prometheus and applications that don’t export metrics in the Prometheus format. For example, Linux does not expose Prometheus-formatted metrics. That’s why Prometheus exporters, like [the node exporter](https://github.com/prometheus/node_exporter), exist.

Some applications like Spring Boot, Kubernetes, etc. expose Prometheus metrics out of the box. On the other hand, exporters consume metrics from an existing source and utilize the Prometheus client library to export metrics to Prometheus.

Prometheus exporters can be stateful or stateless. A stateful exporter is responsible for gathering data and exports them using the general metrics format such as counter, gauge, etc. Stateless exporters are exporters that translate metrics from one format to Prometheus metrics format using counter metric family, gauge metric family, etc. They do not maintain any local state instead they show a view derived from another metric source such as JMX. For example, Jenkins Jobmon is a Prometheus exporter for Jenkins which calls Jenkins API to fetch the metrics on every scrape.

https://github.com/grofers/jenkins-jobmon

# Let’s build a generic HTTP server metrics exporter!

We will build a Prometheus exporter for monitoring HTTP servers from logs. It extracts data from HTTP logs and exports it to Prometheus. We will be using a [python client library](https://github.com/prometheus/client_python), `prometheus_client`, to define and expose metrics via an HTTP endpoint.

![One of the metrics from httpd_exporter](https://miro.medium.com/max/1400/1*tnVyecPLcTgwQY0LbChBxw.png)

Our HTTP exporter will repeatedly follow server logs to extract useful information such as HTTP requests, status codes, bytes transferred, and requests timing information. HTTP logs are structured and standardized across different servers such as Apache, Nginx, etc. You can read more about it from [here](https://publib.boulder.ibm.com/tividd/td/ITWSA/ITWSA_info45/en_US/HTML/guide/c-logs.html).

```
127.0.0.1 user-identifier frank [10/Oct/2000:13:55:36 -0700] "GET /apache_pb.gif HTTP/1.0" 200 2326
```

- We will use a counter metric to store the HTTP requests using status code as a label.
- We will use a counter metric to store bytes transferred.

Here is the script which collects data from apache logs indefinitely and exposes metrics to Prometheus :

 https://gist.github.com/Nancy-Chauhan/105d9db52a06fe37d0039cad6a037a93

The `follow_log` function tails apache logs stored var/log/apache in your system infinitely. `gather_metrics()` uses a regular expression to fetch the useful information from logs like status_code and total_bytes_sent and accordingly increments the counters.

If you run the script, it will start the server at http://localhost:8000 The collected metrics will show up there. Setup [Prometheus](https://github.com/Nancy-Chauhan/httpd_exporter/blob/master/prometheus/prometheus.yml) to scrape the endpoint. Over time, Prometheus will build the time-series for the metrics collected. Setup [Grafana](https://github.com/Nancy-Chauhan/httpd_exporter/blob/master/docker-compose.yml) to visualize the data within Prometheus.

You can find the code here and run the exporter:

https://github.com/Nancy-Chauhan/httpd_exporter

Originally Posted at https://medium.com/@_nancychauhan/building-a-prometheus-exporter-8a4bbc3825f5 
