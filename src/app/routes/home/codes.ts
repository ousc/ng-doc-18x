const $dataClass: string = `
@Table(name = "tb_product")
data class Product(
    var code: String? = null,
    @Column(name = "name")
    var productName: String? = null,
    var category: String? = null,
    var quantity: Int? = null
): KPojo
`.trim();

const $select: string = `
Product().select()
  .where{ it.productName == "Sunglasses" }
  .query()

Product().select()
    .where{ it.productName in listOf("Sunglasses", "Bamboo Watch") }
    .orderBy{ it.quantity }
    .query()

Product("f230fh0g3").select().by{ it.code }.query()
`.trim();

const $insert: string = `
Product("a3c2a3fv2", "Sunglasses", "Fashion", 3).insert().execute()

listOf(
    Product("c0a45pzo2", "Apple Watch", "Fashion", 3),
    Product("q1fj099af", "Portable Speakers", "Electronics", 2)
)
  .insert().batchExecute()
`.trim();

const $delete: string = `
Product("c0a45pzo2").delete()
  .by{ it.code }
  .execute()

Product().delete()
  .where{ it.category == "Fashion" && it.quantity < 3 }
  .execute()

Product("a3c2a3fv2").delete()
  .where{ it.code.eq }
  .execute()
`.trim();

const $update: string = `
Product("a3c2a3fv2", "Apple Watch", "Electronics", 0)
  .update()
  .by{ it.code }
  .execute()

Product("a3c2a3fv2", "Apple Watch", quantity = 0)
  .update{ it.name + it.quantity }
  .by{ it.code }
  .execute()

Product().update()
  .set{
    it.name = "Apple Watch"
    it.category = "Electronics"
  }
  .where{ it.code == "a3c2a3fv2" }
  .execute()

Product(productName = "Watch").update()
  .set{
    it.quantity = 0
  }
  .where{ it.productName.matchBoth }
  .execute()
`.trim();

const $upsert: string = `
val product = Product("a3c2a3fv2", "Apple Watch", "Electronics", 0)
product.upsert()
  .on{ it.code }
  .execute()

product.upsert{ it.name + it.quantity }
  .onDuplicateKey()
  .execute()
`.trim()

export const codes: {
  label: string,
  icon: string,
  doc: string,
  rowNum: number,
  runnable: { [key: number]: boolean },
  tip: { [key: number]: string }
}[] = [
  {
    label: 'KPojo', icon: 'pi pi-code', doc: $dataClass, rowNum: $dataClass.split('\n').length,
    runnable: {},
    tip: {
      0: "You can specify the table name with [Table] annotation.",
      1: "Make sure your data class has a no-arg constructor.",
      3: "You can specify the column name with [Column] annotation.",
      7: "Your data class should implements interface [KPojo]."
    }
  },
  {
    label: 'SELECT', icon: 'pi pi-table', doc: $select, rowNum: $select.split('\n').length,
    runnable: {0: true, 4: true, 9: true},
    tip: {}
  },
  {
    label: 'INSERT', icon: 'pi pi-plus', doc: $insert, rowNum: $insert.split('\n').length,
    runnable: {0: true, 2: true},
    tip: {}
  },
  {
    label: 'DELETE', icon: 'pi pi-minus', doc: $delete, rowNum: $delete.split('\n').length,
    runnable: {0: true, 4: true, 8: true},
    tip: {}
  },
  {
    label: 'UPDATE', icon: 'pi pi-pencil', doc: $update, rowNum: $update.split('\n').length,
    runnable: {0: true, 5: true, 10: true, 18: true},
    tip: {}
  },
  {
    label: 'UPSERT', icon: 'pi pi-refresh', doc: $upsert, rowNum: $upsert.split('\n').length,
    runnable: {0: true, 5: true},
    tip: {}
  }
]
