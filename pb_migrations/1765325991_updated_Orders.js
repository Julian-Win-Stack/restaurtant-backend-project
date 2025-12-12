/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3583018390")

  // add field
  collection.fields.addAt(4, new Field({
    "hidden": false,
    "id": "date77385438",
    "max": "",
    "min": "",
    "name": "orderDate",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "date"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3583018390")

  // remove field
  collection.fields.removeById("date77385438")

  return app.save(collection)
})
