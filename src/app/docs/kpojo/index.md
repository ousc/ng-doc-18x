# KPojo数据表类定义

在Kronos中声明一个data class为数据表类非常简单，只需要让该类继承`KPojo`即可。

简单示例：

```kotlin
import com.kotlinorm.beans.dsl.KPojo

data class User(
    val id: Int,
    val name: String,
    val age: Int
) : KPojo()
```

我们通过一些注解和配置项来定义数据表的属性，如：主键、自增、唯一键、索引等。

> **Note**
> 为什么使用注解而不是kotlin dsl？
>
> 我们通过编译器插件读取注解信息并将信息保存在实体类定义中，使全部的表结构解析都发生在**编译期**而不是运行期，这样虽然失去了部分灵活性，但是可以避免运行时的性能损耗。

## 全局配置项

### 全局表名策略

| 参数名                   | 类型                     | 默认值                  |
|-----------------------|------------------------|----------------------|
| `tableNamingStrategy` | `KronosNamingStrategy` | `NoneNamingStrategy` |

通过创建`KronosNamingStrategy`的实现类来自定义表名策略（详见：[KronosNamingStrategy](/KronosNamingStrategy)），然后在配置文件中指定该实现类。

我们默认提供了`LineHumpNamingStrategy`表名策略：

该策略将kotlin类名转换为下划线分隔的小写字符串，如：`ADataClass` -> `a_data_class`，将数据库表/列名转为驼峰命名，如：`user_name` -> `userName`。

```kotlin
Kronos.tableNamingStrategy = LineHumpNamingStrategy
```

### 全局列名策略

| 参数名                   | 类型                     | 默认值                  |
|-----------------------|------------------------|----------------------|
| `fieldNamingStrategy` | `KronosNamingStrategy` | `NoneNamingStrategy` |

通过创建`KronosNamingStrategy`的实现类来自定义表名策略（详见：[KronosNamingStrategy](/KronosNamingStrategy)），然后在配置文件中指定该实现类。

我们默认提供了`LineHumpNamingStrategy`表名策略：

该策略将kotlin类名转换为下划线分隔的小写字符串，如：`ADataClass` -> `a_data_class`，将数据库表/列名转为驼峰命名，如：`user_name` -> `userName`。

```kotlin
Kronos.fieldNamingStrategy = LineHumpNamingStrategy
```

### 创建时间策略

| 参数名                  | 类型                     | 默认值                                                        |
|----------------------|------------------------|------------------------------------------------------------|
| `createTimeStrategy` | `KronosCommonStrategy` | `KronosCommonStrategy(false, "create_time", "createTime")` |

通过创建`KronosCommonStrategy`的实现类来自定义创建时间策略（详见：[KronosCommonStrategy](/KronosCommonStrategy)），然后在配置文件中指定该实现类。

创建时间策略的全局默认关闭，需要手动开启。

```kotlin
Kronos.createTimeStrategy = KronosCommonStrategy(true, Field("create_time", "createTime"))
```

全局设置逻辑删除策略后，仍可在`KPojo`类中通过`@CreateTime`注解覆盖全局设置。

### 更新时间策略

| 参数名                  | 类型                     | 默认值                                                        |
|----------------------|------------------------|------------------------------------------------------------|
| `updateTimeStrategy` | `KronosCommonStrategy` | `KronosCommonStrategy(false, "update_time", "updateTime")` |

通过创建`KronosCommonStrategy`的实现类来自定义更新时间策略（详见：[KronosCommonStrategy](/KronosCommonStrategy)），然后在配置文件中指定该实现类。

更新时间策略的全局默认关闭，需要手动开启。

```kotlin
Kronos.updateTimeStrategy = KronosCommonStrategy(true, Field("update_time", "updateTime"))
```

全局设置逻辑删除策略后，仍可在`KPojo`类中通过`@UpdateTime`注解覆盖全局设置。

### 逻辑删除策略

| 参数名                   | 类型                     | 默认值                                      |
|-----------------------|------------------------|------------------------------------------|
| `logicDeleteStrategy` | `KronosCommonStrategy` | `KronosCommonStrategy(false, "deleted")` |

通过创建`KronosCommonStrategy`的实现类来自定义逻辑删除策略（详见：[KronosCommonStrategy](/KronosCommonStrategy)），然后在配置文件中指定该实现类。

逻辑删除策略的全局默认关闭，需要手动开启。

```kotlin
Kronos.logicDeleteStrategy = KronosCommonStrategy(true, Field("deleted"))
```

全局设置逻辑删除策略后，仍可在`KPojo`类中通过`@LogicDelete`注解覆盖全局设置。

### 默认日期/时间格式

| 参数名                 | 类型       | 默认值                   |
|---------------------|----------|-----------------------|
| `defaultDateFormat` | `String` | `yyyy-MM-dd HH:mm:ss` |

Kronos默认使用`yyyy-MM-dd HH:mm:ss`格式化日期/时间，你可以通过以下方式修改默认格式：

```kotlin
Kronos.defaultDateFormat = "yyyy-MM-dd HH:mm:ss"
```

### 默认时区

| 参数名               | 类型                          | 默认值                      |
|-------------------|-----------------------------|--------------------------|
| `defaultTimeZone` | `kotlinx.datetime.TimeZone` | `currentSystemDefault()` |

Kronos默认使用当前系统时区，你可以通过以下方式修改默认时区：

```kotlin
Kronos.defaultTimeZone = TimeZone.UTC
Kronos.defaultTimeZone = TimeZone.of("Asia/Shanghai")
Kronos.defaultTimeZone = TimeZone.currentSystemDefault()
Kronos.defaultTimeZone = TimeZone.of("GMT+8")
```

## 注解配置

### 表名设置

用于指定数据表的表名，如果不指定则使用默认的表名策略。

**参数**：

- `name`：表名

```kotlin
@Table("tb_user")
data class User(
    val id: Int,
    val name: String,
    val age: Int
) : KPojo()
```

### 表索引

用于指定数据表的索引，如果不指定则不创建索引。

> 仅在使用`tables.create<Table>()`或`tables.syncStructure<Table>()`时生效。

**参数**：
- name：索引名
- columns：索引列名
- type：索引类型
- method：索引方法

```kotlin
@TableIndex("idx_name_age", ["name", "age"], Mysql.KIndexType.UNIQUE, Mysql.KIndexMethod.BTREE)
data class User(
    val id: Int? = null,
    val name: String? = null,
    val age: Int? = null
) : KPojo()
```

### 表创建时间

用于指定数据表是否开启创建时间策略，如果不指定则使用全局设置。

**参数**：
- enabled：是否开启

```kotlin
@CreateTime(enabled = false)
data class User(
    val id: Int? = null,
    val createTime: String? = null
) : KPojo()
```

### 表更新时间

用于指定数据表是否开启更新时间策略，如果不指定则使用全局设置。

**参数**：
- enabled：是否开启

```kotlin
@UpdateTime(enabled = false)
data class User(
    val id: Int? = null,
    val updateTime: String? = null
) : KPojo()
```

### 表逻辑删除

用于指定数据表是否开启逻辑删除策略，如果不指定则使用全局设置。

**参数**：
- enabled：是否开启

```kotlin
@LogicDelete(enabled = false)
data class User(
    val id: Int? = null,
    val deleted: Boolean? = null
) : KPojo()
```

### 列名设置

用于指定数据表的列名，如果不指定则使用默认的列名策略。

**参数**：
- `name`：列名

```kotlin
data class User(
    @Column("user_name")
    val name: String? = null
) : KPojo()
```

### 列日期格式化

用于指定数据表的日期/时间格式，如果不指定则使用默认的日期/时间格式。

**参数**：
- `pattern`：日期/时间格式

```kotlin
data class User(
    @DateTimeFormat("yyyy-MM-dd")
    val birthday: String? = null
) : KPojo()
```

### 列反序列化设置

用于声明该列是否需要反序列化，如果不指定则默认不反序列化，若启用反序列化，将调用`Kronos.serializeResolver.deserialize`方法将该列的值反序列化为指定类型。

```kotlin
data class User(
    @UseSerializeResolver
    val info: String? = null
) : KPojo()

```

### 列关联设置

此注解用于声明列关联，包括关联查询、关联更新、关联删除等。支持一对一、一对多、多对一、多对多关联。

### 列主键设置

### 列类型及长度

### 列非空约束

### 列创建时间

### 列更新时间

### 列逻辑删除





