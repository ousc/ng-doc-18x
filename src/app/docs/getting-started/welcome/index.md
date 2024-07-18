# {{ NgDocPage.title }}

{{ NgDocActions.demo("AnimateLogoComponent", {container: false}) }}

**Kronos ORM(Kotlin Reactive Object-Relational-Mapping)是一款基于KCP、为K2设计的现代化的kotlin ORM框架。**

*Kronos*是一个轻量级的框架，为开发者提供了一种简单操作多种数据库的方案。

*Kronos*使用KCP读取IR表达式，得以使ORM的编写简洁而又语义化，并且通过编译器插件，我们同时提供了Pojo和Map互转的简单方案。

*Kronos*的设计初衷是为了弥补现有ORM框架中不足之处，并基于协程和任务机制对数据操作提供更加便捷和高效的编写体验。

我们支持多种常见关系型数据库，包括Mysql、Oracle、Postgres、Mssql、SQLite，更多数据库类型在我们的计划清单中，欢迎在[Github](https://github.com/Kronos-orm/Kronos-orm)查看我们的最新进展。

```kotlin name="demo" icon="kotlin"
if(!db.table.exsits<User>()){
  db.table.create<User>()
}

val user: User = User(
        id = 1,
        name = "Kronos",
        age = 18
    )
    
user.insert(user)

user.update().set { it.name = "Kronos ORM" }.where { it.id == 1 }.execute()

val nameOfUser: String = user.select{ it.name }.where { it.id == 1 }.queryOne<String>()

user.delete().where { it.id == 1 }.execute()
```

{{ NgDocActions.demo("FeatureCardsComponent", {container: false}) }}
