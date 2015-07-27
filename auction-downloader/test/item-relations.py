from xml.etree import ElementTree
from random import randint
from time import sleep
import traceback
import requests

uniqueItemsDump = open("./unique-items-dump2.csv")
uniqueItemIds = map(lambda uniqueItemId: uniqueItemId.strip(), uniqueItemsDump.readlines())
uniqueItemsDump.close()

with open("./unique-items-dump3.tsv", "a") as uniqueItemIdsUpdated:

	with open("./item-relations-dump2.tsv", "a") as itemRelations:

		with open("./item-recipes-dump2.tsv", "a") as itemRecipes:

			i = 0

			while i < len(uniqueItemIds):

				if randint(0, 10) <= 5:
					sleep(3)

				uniqueItemId = uniqueItemIds[i]

				req = requests.get("http://www.wowhead.com/item=" + uniqueItemId + "&xml")

				i += 1

				if req.status_code != 200:
					print "\n> HTTP error", req.status_code
					print ">item_id=", uniqueItemId
					print ">index=", i
					continue

				try:
					root = ElementTree.fromstring(req.text)
				except Exception, e:
					print "\n>", e
					print traceback.format_exc()
					print ">item_id=", uniqueItemId
					print ">index=", i
					continue

				try:
					item = root.find("item")
					createdBy = item.find("createdBy")
					spell = createdBy.find("spell")
					name = item.find("name").text
				except Exception, e:
					continue

				try:
					print "\n>", spell.get("id"), spell.get("name"), spell.get("minCount"), spell.get("maxCount")
					print ">", i, "/", len(uniqueItemIds), "-", (i / (len(uniqueItemIds) / 100)), "%"

					itemRecipes.write(
						"\t".join([
							uniqueItemId,
							name,
							spell.get("id"),
							spell.get("name"),
							spell.get("minCount"),
							spell.get("maxCount"),
							"\n"
						])
					)

					for reagent in spell.iter("reagent"):
						print "\t> ", reagent.get("id"), reagent.get("name"), reagent.get("count")

						itemRelations.write(
							"\t".join([
								uniqueItemId,
								name,
								reagent.get("id"),
								reagent.get("name"),
								reagent.get("count"),
								"\n"
							])
						)

						if reagent.get("id") not in uniqueItemIds:
							uniqueItemIds.append(
								reagent.get("id").strip()
							)

							uniqueItemIdsUpdated.write(
								reagent.get("id").strip() + "\n"
							)
				except Exception, e:
					print "\n>", e
					print traceback.format_exc()
					print ">item_id=", uniqueItemId
					print ">index=", i
					continue
