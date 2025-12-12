/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3583018390")

  // add field
  collection.fields.addAt(3, new Field({
    "hidden": false,
    "id": "number2683508278",
    "max": null,
    "min": 1,
    "name": "quantity",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3583018390")

  // remove field
  collection.fields.removeById("number2683508278")

  return app.save(collection)
})
