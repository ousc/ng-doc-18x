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

- name `string`：表名

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
- name `string`：索引名
- columns `Array<String>`：索引列名
- type `String`：索引类型（可选）
- method `String`：索引方法（可选）

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
- enabled `Boolean`：是否开启

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
- enabled `Boolean`：是否开启

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
- enabled `Boolean`：是否开启

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
- name `String`：列名

```kotlin
data class User(
    @Column("user_name")
    val name: String? = null
) : KPojo()
```

### 列日期格式化

用于指定数据表的日期/时间格式，如果不指定则使用默认的日期/时间格式。

**参数**：
- pattern `String`：日期/时间格式

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
    @ColumnDeserialize
    val info: String? = null
) : KPojo()

```

### 列关联设置

此注解用于声明列关联，包括关联查询、关联更新、关联删除等。支持一对一、一对多、多对一、多对多关联。
kronos将关联列视为自定义属性，不会将其识别为数据库字段。

**参数**：
- referenceColumn `Array<String>`：关联列名
- targetColumn `Array<String>`：关联目标列名
- cascade `String`：关联级联策略（可选）
- mapperBy `String`：维护端列名（可选）

```kotlin
@Table("tb_user")
data class Employee(
    val id: Int? = null,
    val companyId: Int? = null,
    @Reference(["company_id"], ["id"])
    val company: Company? = null
): KPojo()

@Table("tb_company")
data class Company(
    val id: Int? = null,
    val employees: List<Employee>? = null
): KPojo()
```

### 列主键设置

此注解用于声明列为主键。

**参数**：
- identity `Boolean`：是否自增

```kotlin
@Table("tb_user")
data class User(
    @PrimaryKey(identity = true)
    val id: Int? = null
): KPojo()
```

### 列类型及长度

对于不同的数据库类型，kronos会根据kotlin类型自动转换类型，您可以参考[类型对照表](/TypeConversion)查看Kotlin数据类型在各个数据库中的映射关系。
您可以通过此注解声明列类型及长度，如果不指定则使用默认的类型及长度，全部类型信息请参考：[字段类型](/KColumnType)

**参数**：
- type `String`：类型
- length `Int`：长度

```kotlin
@Table("tb_user")
data class User(
    @ColumnType(KColumnType.Char, 10)
    val name: String? = null
): KPojo()
```

### 列非空约束

此注解用于声明列为非空，如果不指定则使用默认的非空约束

```kotlin
@Table("tb_user")
data class User(
    @NotNull
    val name: String? = null
): KPojo()
```

### 列创建时间

此注解用于声明列为创建时间字段，如果不指定则使用默认的创建时间策略。

**参数**：
- enabled `Boolean`：是否启用

```kotlin
@Table("tb_user")
data class User(
    @CreateTime
    val created: String? = null
): KPojo()
```

### 列更新时间

此注解用于声明列为更新时间字段，如果不指定则使用默认的更新时间策略。

**参数**：
- enabled `Boolean`：是否启用

```kotlin
@Table("tb_user")
data class User(
    @UpdateTime
    val updated: String? = null
): KPojo()
```

### 列逻辑删除

此注解用于声明列为逻辑删除字段，如果不指定则使用默认的逻辑删除策略。

**参数**：
- enabled `Boolean`：是否启用

```kotlin
@Table("tb_user")
data class User(
    @LogicDelete
    val deleted: String? = null
): KPojo()
```



