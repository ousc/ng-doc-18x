<center>
  <img src="/assets/images/logo_circle.png" width="200" alt="kronos-orm-logo">
</center>

##### Kronos ORM(Kotlin Reactive Object-Relational-Mapping)是一款基于KCP、为K2设计的现代化的kotlin ORM框架。

*Kronos*是一个轻量级的框架，为开发者提供了一种简单操作多种数据库的方案。

*Kronos*使用KCP读取IR表达式，得以使ORM的编写简洁而又语义化，并且通过编译器插件，我们同时提供了Pojo和Map互转的简单方案。

*Kronos*的设计初衷是为了弥补现有ORM框架中不足之处，并基于协程和任务机制对数据操作提供更加便捷和高效的编写体验。
我们支持多种常见关系型数据库，包括Mysql、Oracle、Postgres、Mssql、SQLite，更多数据库类型在我们的计划清单中，欢迎去[Github](Github)查看我们的最新进展。

-------

# 快速上手：


## 1.添加依赖：

kronos-orm是一个多模块的项目，我们提供了多个模块供开发者选择，开发者可以根据自己的需求选择对应的模块。

其中：

1. `kronos-core`是**必选模块**，它提供了基础的ORM功能
2. `kronos-logging`是可选模块，它提供了多平台的日志功能
3. `kronos-jvm-driver-wrapper`是可选模块，它提供了JVM驱动包装器。（您可以使用其他官方驱动包装器或自己编写包装类轻松地搭配第三方框架（如SpringData、Mybatis、Hibernate、Jdbi等）使用）
4. `kronos-compiler-plugin`插件是**必选模块**，它为Kronos的ORM功能提供了编译时支持


```kotlin group="import" name="gradle(kts)" icon="gradlekts"
    dependencies {
        implementation("com.kotlinorm.kronos-core") version "1.0.0"
        implementation("com.kotlinorm.kronos-logging") version "1.0.0"
        implementation("com.kotlinorm.kronos-jvm-driver-wrapper") version "1.0.0"
    }
    
    plugins {
        id("com.kotlinorm.kronos-compiler-plugin") version "1.0.0"
    }
```

```groovy group="import" name="gradle(groovy)" icon="gradle"
    dependencies {
        implementation 'com.kotlinorm:kronos-core:1.0.0'
        implementation 'com.kotlinorm:kronos-logging:1.0.0'
        implementation 'com.kotlinorm:kronos-jvm-driver-wrapper:1.0.0'
    }
    
    plugins {
        id 'com.kotlinorm.kronos-compiler-plugin' version '1.0.0'
    }
```

```xml group="import" name="maven" icon="maven"
  <project>
    <dependencies>
      <dependency>
        <groupId>com.kotlinorm</groupId>
        <artifactId>kronos-core</artifactId>
        <version>1.0.0</version>
      </dependency>
      <dependency>
        <groupId>com.kotlinorm</groupId>
        <artifactId>kronos-logging</artifactId>
        <version>1.0.0</version>
      </dependency>
      <dependency>
        <groupId>com.kotlinorm</groupId>
        <artifactId>kronos-jvm-driver-wrapper</artifactId>
        <version>1.0.0</version>
      </dependency>
    </dependencies>
  
    <build>
      <plugins>
        <plugin>
          <groupId>com.kotlinorm</groupId>
          <artifactId>kronos-compiler-plugin</artifactId>
          <version>1.0.0</version>
        </plugin>
      </plugins>
    </build>
  </project>
```

## 2.配置数据库：

这里仅介绍`kronos-jvm-driver-wrapper`模块的使用，其他模块的使用方式类似。
需引入commons-dbcp2、mysql-connector-java等依赖。

```kotlin group="KronosConfig" name="KronosConfig.kt"
import com.kotlinorm.Kronos
Kronos.apply {
  dataSource = {
    BasicDataSource().apply {
        driverClassName = "com.mysql.cj.jdbc.Driver"
        url = "jdbc:mysql://localhost:3306/kronos?useUnicode=true&characterEncoding=utf-8&useSSL=false&serverTimezone=UTC"
        username = "root"
        password = "rootroot"
    }
  }
  
}
```

## 3.编写实体类：

```kotlin group="KPojo" name="Director.kt"
data class Director(
    @PrimaryKey(identity = true)
    var id: Int? = 0,
    var name: String? = "",
    var age: Int? = 0,
    var movies: List<Movie>? = emptyList(),
    @CreateTime
    @DateTimeFormat("yyyy-MM-dd HH:mm:ss")
    var createTime: String? = "",
    @updateTime
    @DateTimeFormat("yyyy-MM-dd HH:mm:ss")
    var updateTime: String? = "",
    @LogicDelete
    var deleted: Boolean? = false
): KPojo()
```

```kotlin group="KPojo" name="Movie.kt"
@Table(name = "tb_movie")
@TableIndex("idx_name_director", ["name", "director_id"], Mysql.KIndexType.UNIQUE, Mysql.KIndexMethod.BTREE)
data class Movie(
    @PrimaryKey(identity = true)
    var id: Int? = 0,
    @Column("name")
    @ColumnType(CHAR)
    @Default("UNKNOWN")
    var name: String? = "",
    var directorId: Long? = 0,
    @Reference(["director_id"], ["id"])
    var director: Director? = "",
    var releaseTime: String? = "",
    @LogicDelete
    var deleted: Boolean? = false,
    @CreateTime
    var createTime: LocalDateTime? = "",
    @updateTime
    var updateTime: Date? = ""
): KPojo()
```

```kotlin  name="database-operation.ts"
User(1).insert().execute() // 插入单行数据
listOfUser.insert().execute() // 批量插入多行数据

User(1, "name").update{ it.username }.by{ it.id }.execute() //条件更新
User(username = "name").update{ it.username }.where{ it.id between 1..100 }.execute() //条件更新
listOfUser.update{ it.username }.by{ it.id }.execute() //批量条件更新

val user: User? = User().select().where{ it.id > 1 && it.username.notNull }.queryForObjectOrNull()

// 2.多条件查询 / 查询多个字段 / 类型解析 / 带分页 / 带去重 / 带排序
val (users, total) =
    user.select { it.id + it.userName + it.authCode + "(select xxx from xxx limit 1)".alias("t") }
        .where { it.id == 1 && "complex condition".toSql() }
        .by{ it.id }
        .page(1, 10)
        .orderBy{ it.updateTime.desc }
        .distinct()
        .withTotal()
        .queryForList() // Pair<List<User>, Int>


// 3.连表查询 / 使用query()查询List<Map<String, Any>>多行数据
val result: List<Map<String, Any>> =
    User().join(ShoppingCart(), Good()){ user, cart, good ->
        leftJoin(cart)
            .on(user.id == cart.id && user.age > 35)
        rightJoin(good)
            .on(good.id == cart.id)
        select(user, good.id, cart.id)
        where (
            user.id == 1 &&
                    user.age >= 20 &&
                    user.email like "%@qq.com" &&
                    user.telephone notLike "159%" &&
                    (
                            user.userName in listOf("a", "b") ||
                                    user.id !in listOf(1, 2, 3)
                            ) &&
                    user.nickname.notNull &&
                    user.age between 1..2 &&
                    user.age notBetween 1..2
        )
        groupBy(user.age)
        page(1, 100)
    }
        .withTotal()
        .query()
```

------

> 插入示例：

```kotlin
// 1.插入一行数据
val affectRowNumber: Pair<Int, Int> = 
    User(1).insert().execute()

// 2.根据主键更新或插入一行数据
val affectRowNumber: Pair<Int, Int> = 
    User(1).upsert()
        .set{ it.createTime = "YYYY-MM-DD" }
        .execute()
			
// 3.根据部分列更新或插入一行数据
val affectRowNumber: Pair<Int, Int> = 
    User(1).upsert{ it.id }
        .onDuplicate() // 默认
        .execute()

// 4.根据部分列更新或插入一行数据
val affectRowNumber: Pair<Int, Int> = 
    User(1, "name", "email@example.com").upsert{ it.id }
        .by{ it.name + it.email }
        .execute()

// 5.根据部分列更新或插入一行数据 / 更新时排除部分列
val affectRowNumber: Pair<Int, Int> =
    User(1, "name", "email@example.com").upsertExcept{ it.id }
        .by{ it.name + it.email }
        .execute()
```

------

> 更新示例：

```kotlin
// 更新行
val affectRowNumber: Int = 
		User(1).update()
			.set { it.id = 2 }
			.by { it.id }
			.execute()
				
// 更新行 / 仅更新部分字段
val affectRowNumber: Int = 
		User(2).update{ it.id }
			.where{ it.id == 1 }
			.execute()

// 更新行 / 更新时排除部分列
val affectRowNumber: Int =
        User(2).updateExcept{ it.id }
            .where{ it.id == 1 }
            .execute()
```

------

> 删除示例：

```kotlin
val affectRowNumber: Int = 
		User(id = 1, status = 1).remove()
			.by { it.id + it.status }
            //.where()
			.execute()
				
val affectRowNumber: Int = 
		User().remove()
			.where { it.id > 1 && it.id < 10  }
			.execute()
```

------

[Read more on GitHub](
