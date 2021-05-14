---
title:  Designing Idempotent APIs
author:  Nancy Chauhan
date:   2021-05-14
hero: ./images/cover.jpeg
excerpt: Networks fail! Timeouts, outages, and routing problems are bound to happen at any time. It challenges us to design our APIs and clients that will be robust in handling failures and ensuring consistency.
---

Networks fail! Timeouts, outages, and routing problems are bound to happen at any time. It challenges us to design our APIs and clients that will be robust in handling failures and ensuring consistency.

We can design our APIs and systems to be idempotent, which means that they can be called any number of times while guaranteeing that side effects only occur once. Let’s get a deeper dive into why incorporating idempotency is essential, how it works, and how to implement it.

# Why Idempotency is critical in backend applications?

Consider the design of a social networking site like Instagram where a user can share a post with all their followers. Let’s assume that we are hosting the app-server and database-server on two different machines for better performance and scalability. And also, we are using PostgreSQL to store the data. A post and creating a post will have the following model:

```
CREATE TABLE public.posts (
   id int(11) PRIMARY KEY,
   user_id int(11) REFERENCES users,
   image_id int(11) REFERENCES images NULL,
   content character varying(2048) COLLATE pg_catalog."default",
   create_timestamp timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

## Failures and Retries

If we have our database on a separate server from our application server, sometimes posts will fail because of network issues. There could be the following issues:
- The initial connection could fail as the application server tries to connect to a database server.
- The call could fail midway while the app server is fulfilling the operation, leaving the work in limbo.
- The call could succeed, but the connection breaks before the database server can tell the application server about it.

![Retry](https://miro.medium.com/max/1400/1*gtfaDxb3P6Ut-rznIwy78g.png)

We can fix this with retry logic, but it is very tough to suspect the real cause of network failure. Hence it could lead to a scenario where the entry of the post has been made in the database but it could not send the ACK to the app server. Here app server unknowingly keeps retrying and creating duplicate posts. This would eventually lead to business loss. There are many other critical systems like payments, shopping sites, where idempotent systems are quite important.

## Solution
The solution to this is to retry, but make the operation idempotent. If an operation is idempotent, the app server can make that same call repeatedly while producing the same result.

In our design, we can use universally unique identifiers. Each post will be given its own UUID by our application server. We can change our models to have a unique key constraint.

```

CREATE TABLE public.posts (
   id uuid PRIMARY KEY,
   user_id uuid REFERENCES users,
   image_id uuid REFERENCES images NULL,
   content character varying(2048) COLLATE pg_catalog."default",
   create_timestamp timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO posts (id, user_id, image_id, content)
VALUES ("DC2FB40E-058F-4208-B9A3-EB1790C532C8", "20C5ADC5-D1A5-4A1F-800F-1AADD1E4E954", "3CC32CAE-B6AC-4C53-97EC-25EB49F2E7F3", "Hello-world") RETURNING id ON CONFLICT DO NOTHING;
```

Our application server will generate the UUID when it wants to create a post and retry the Insert statement until it gets a successful response from a database server. We need to change our system to handle constraint violations and return the existing post. Hence, there will always be exactly one post created.

# Idempotency in HTTP

One of the important aspects of HTTP is the concept that some methods are idempotent. Take GET for an example, how many times you may call the GET method it results in the same outcome. On the other hand, POST is not expected to be an idempotent method, calling it multiple times may result in incorrect updates.

Safe methods don’t change the representation of the resource in the server e.g. GET method should not change the content of the page your accessing. They are read-only methods while the PUT method will update the page but will be idempotent in nature. To be idempotent, only the actual back-end state of the server is considered, the status code returned by each request may differ: the first call of a DELETE will likely return a 200, while successive ones will likely return a 404.

```
DELETE /idX/delete HTTP/1.1   -> Returns 200 if idX exists
DELETE /idX/delete HTTP/1.1   -> Returns 404 as it just got deleted
DELETE /idX/delete HTTP/1.1   -> Returns 404
```

- GET is both safe and idempotent.
- HEAD is also both safe and idempotent.
- OPTIONS is also safe and idempotent.
- PUT is not safe but idempotent.
- DELETE is not safe but idempotent.
- POST is neither safe nor idempotent.
- PATCH is also neither safe nor idempotent.

The HTTP specification defines certain methods to be idempotent but it is up to the server to actually implement it. For example, send a request-id header with a UUID which the server uses to deduplicate PUT request. If you are serving a GET request, we should not change the server-side data.

# Conclusion 

Designing idempotent systems is important for building a resilient microservice-based architecture. This helps in solving a lot of problems caused due to the network which is inherently lossy. By leveraging an idempotent queue such as Kafka, it makes sure your operations can be retried in case of a long outage. This helps you to design systems that never lose data and any missing data can be adjusted by replaying the message queue. If all operations are idempotent it will result in the same state regardless of how many times messages are processed.

