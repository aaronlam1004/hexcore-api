const fs = require('fs');
const express = require('express');

var router = express.Router();

const SETS = ["6", "6-5"]

function BuildErrorJson(message) {

}


SETS.forEach((set) => {
  let folder = set.replace('-', '.');

  let championData = fs.readFileSync(`../set${folder}/champions.json`);
  let champions = JSON.parse(championData);

  let itemData = fs.readFileSync(`../set${folder}/items.json`);
  let items = JSON.parse(itemData);

  let traitData = fs.readFileSync(`../set${folder}/traits.json`);
  let traits = JSON.parse(traitData);

  router.get(`/set${set}/champions`, function(req, res) {
    if (req.query.name) {
      for (let champion of champions) {
        let currChampion = champion["name"].toLowerCase();
        if (currChampion === req.query.name.toLowerCase()) {
          return res.json(champion);
        }
      }
      return res.status(404).send(`${req.query.name} is not present in this set.`);
    }

    let retChamps = [...champions];
    if (req.query.cost) {
      let cost = req.query.cost.split(' ').map(Number);
      retChamps = retChamps.filter(champion => {
        return cost.includes(champion["cost"]);
      });
    }

    if (req.query.traits) {
      let traits = req.query.traits.split(' ').map(trait => { return trait.toLowerCase(); });
      retChamps = retChamps.filter(champion => {
        for (let trait of traits) {
          let lowerTraits = champion["traits"].map(trait => { return trait.toLowerCase(); });
          if (lowerTraits.includes(`set${set}_${trait}`)) {
            return true;
          }
        }
        return false;
      });
    }

    return res.json(retChamps);
  });

  router.get(`/set${set}/traits`, function (req, res) {
    if (req.query.name) {
      for (let trait of traits) {
        let name = req.query.name.toLowerCase();
        if (trait["name"].toLowerCase() === name) {
          return res.json(trait);
        }
      }
    }

    let retTraits = [...traits];
    if (req.query.type) {
      retTraits = retTraits.filter(trait => {
        let queryType = req.query.type.toLowerCase();
        if (trait["type"].toLowerCase() === queryType) {
          return true;
        }
        return false;
      });
    }

    return res.json(retTraits)
  });

  router.get(`/set${set}/items`, function (req, res) {
    if (req.query.id) {
      for (let item of items) {
        if (item["id"] === parseInt(req.query.id)) {
          return res.json(item);
        }
      }
    }

    if (req.query.name) {
      for (let item of items) {
        if (item["name"].toLowerCase() === req.query.name.toLowerCase()) {
          return res.json(item);
        }
      }
    }

    let retItems = [...items];
    if (req.query.attr) {
      let attributes = req.query.attr.split(' ');
      if (typeof(attributes) === String) {
        attributes = [attributes];
      }
      for (var i = 0; i < attributes.length; i++) {
        switch (attributes[i].toLowerCase()) {
          case "unique":
            attributes[i] = "isUnique";
            break;
          case "elusive":
            attributes[i] = "isElusive";
            break;
          case "artifact":
            attributes[i] = "isArtifact";
            break;
          case "radiant":
            attributes[i] = "isRadiant";
            break;
          default:
            attributes[i] = "";
            break;
        }
      }
      console.log(attributes);

      retItems = retItems.filter(item => {
        for (let attribute of attributes) {
          try {
            if (item[attribute] === true) {
              return true;
            }
          }
          catch {
            continue;
          }
        }
        return false;
      });
    }
    return res.json(retItems);
  });

  router.get(`/set${set}/imgs`, function (req, res) {
    if (req.query.champion) {
      for (let champion of champions) {
        let currChampion = champion["name"].toLowerCase();
        if (currChampion == req.query.champion.toLowerCase()) {
          return res.sendFile(`set${folder}/champions/${champion["id"]}.png`, {"root": '../'});
        }
      }
    }

    if (req.query.item) {
      for (let item of items) {
        let currItem = item;
        if (currItem["id"] === Number(req.query.item)) {
          return res.sendFile(`set${folder}/items/${item["id"]}.png`, {"root": '../'});
        }
        else if (currItem["name"].toLowerCase() === req.query.item.toLowerCase()) {
          return res.sendFile(`set${folder}/items/${item["id"]}.png`, {"root": '../'});
        }
      }
    }

    if (req.query.trait) {
      for (let trait of traits) {
        let currTrait = trait;
        if (currTrait["name"].toLowerCase() === req.query.trait.toLowerCase()) {
          return res.sendFile(`set${folder}/traits/${trait["name"]}.svg`, {"root": '../'});
        }
      }
    }
  });
});

module.exports = router;
