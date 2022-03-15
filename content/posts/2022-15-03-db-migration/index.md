---
title:  What did I learn after running the wrong set of migrations on the database?
author:  Nancy Chauhan
date:   2022-03-15
hero: ./images/cover.jpg
excerpt: Recently at my work, I applied the wrong set of migrations in the database. It eventually broke the stuff and no one could access the system. I panicked, but I focused more on learning new things!

---

Recently at my work, I applied the wrong set of migrations in the database. It eventually broke the stuff and no one could access the system. I panicked, but I focused more on learning new things!

This blog will take a deep dive into database migrations, what database schema migrations are, why we need them and different implementation strategies. Later, we will look at the scenario where things went wrong by applying the wrong set of migrations on the DB and how to avoid it.

# Database Migrations

While developing an application, you might need to store a new kind of information at some point. Perhaps you might need to add a new field. At this point, you will have to change the structure of your database. The process of incremental changes to the relational database structure is called *Database schema migration.*

Migrations help transition database schemas to a new desired state from their current state. It can include deleting specific rows and columns, adding a new set of rows, modifying the type of constraints, etc.
In short, we can say what Git is to manage changes in source code; similarly, migrations are to the database.

![Migrations: Version control for database schema](https://miro.medium.com/max/1400/1*BZLhlhNiYtzHLUyiTIfJsA.png)

# What is a migration script?

A migration script, or a ‘change’ script, alters a database. It is used for versioning database changes by capturing every change as a migration script. We save state transitions in migration files, which describe how to get to the new state and revert the changes to get back to the old state when required.

In the below diagram, each migration script has a unique sequence number so that you know in which order 
to apply migrations.

![migration script](https://miro.medium.com/max/1400/0*79qEwXY9Yw0xSCbd.png)

*Image source: https://cloud.google.com/architecture/devops/devops-tech-database-change-management*

# Why do we need it?

Database migrations are helpful as they help to ease the process of changes in the databases as the requirements change. It eventually allows developers to execute database schema changes safely. The key idea is: since developers can make code changes that are easy to roll back using Git, why can’t developers do the same thing when it comes to schema changes?

# How do you perform database migration?

How you perform database migration heavily depends on the tool you are using for the task.

## Framework/Language dependent library

Some frameworks (like Django, Spring, etc.) provide well-documented database migration libraries. Most libraries chosen by the framework take care of migrations for you. Libraries like Django, Alembic or Liquibase help define migration as code where we describe the desired state of the database. The library takes care of generating the appropriate DDL and executing them. The primary advantage of this approach is, it helps to keep the migration code separate from the database in use. However, it also limits us to the common subset of SQL features.

Some libraries provide autogeneration features. They inspect the changes made in database models and generate the migration code. Some libraries like play evolutions and Flyway require us to define raw DDL in migrations. This allows us to use the full power of the database that we are using, but it also means we will have to define migrations by ourselves and become database dependent.

##  Independent database migration-focused software
In some cases, you can use software like Flyway that acts as source control for your database. They, too, provide a command-line way to generate the migrations and allow custom coding to capture the database schema migrations.

# How do migrations run?

- Whenever we run migrations, it first checks the last migration applied from the schema history table. This table is tool-specific.
- The migration tool scans the filesystem for new migration.
- For every new migration it discovers, it creates a transaction, applies the DDL and adds a new entry to the schema history table.
- In case of a rollback, it identifies the migrations that need to be unapplied, executes the corresponding DDL and removes the entry from the schema history table.
  
This is a straightforward example of a migration tool :
https://github.com/Nancy-Chauhan/migrations/blob/master/migration.py

# How did I break the system, and what happened?

I connected a different play project to a different database than intended. Play framework discovered a different set of migration than the one recorded in the schema history table. It wrongly determined that the migrations have been changed and unapplied the existing set of migration. The database ended up in an inconsistent state.

Play framework goes a step beyond traditional migration tools and stores the hash of the migration script along with “apply/unapply” DDL in the schema history table. This allows it to roll back migration even when the original migration script is unavailable or changed.

# How did I fix it, and what did I learn?

The usual way of fixing this is to restore the snapshot of the entire database, which can be a very lengthy process. But if you inspect the missing migrations, you may find that not all migrations alter the database drastically. By comparing the schema history table, you will find the missing migration and run them manually. This also helps in cases when you have run a buggy migration.

In my case, I was lucky that not all migrations were unapplied due to a bug in a “down” script of a migration. Play unapplied till the buggy migration. The changes after the migration were not a lot, and I was able to run the migration manually and change a few bits of data to bring the database back to consistency.

# What did I learn?

- In a production environment, never allow migration tools to automatically unapply a migration.
- Always have a backup of databases before any migration.
- If migration gets messed up, inspect the schema history table to find if you can perform some manual correction to get the service up and running quickly.


This helped me learn the internals of database migration and realised that breaking stuff makes you learn more!

Keep on learning! 💜
