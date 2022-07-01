const fs = require('fs');
const express = require('express');

var router = express.Router();

const SETS = ["7", "6", "6.5"]

/**
 * Creates error JSON to return back to the user 
 * @param errorCode: the code/status of the error
 * @param errorType: the type of error that occured
 * @param errorMessage: the error message
 **/
function CreateErrorJson(errorCode, errorType, errorMessage) {
  return {
    "status": errorCode,
    "type": errorType,
    "message": errorMessage,
  }
}

SETS.forEach((set) => {
  let setName = set.replace('.', '-');

  let championData = fs.readFileSync(`./sets/set${set}/champions.json`);
  let champions = JSON.parse(championData);

  let itemData = fs.readFileSync(`./sets/set${set}/items.json`);
  let items = JSON.parse(itemData);

  let traitData = fs.readFileSync(`./sets/set${set}/traits.json`);
  let traits = JSON.parse(traitData);

  // Champions
  router.get(`/set${set}/champions`, function(req, res) {
    if (req.query.name) {
      for (let champion of champions) {
        let currChampion = champion["name"].toLowerCase();
        if (currChampion === req.query.name.toLowerCase()) {
          return res.json(champion);
        }
      }
      return res.status(404).json(CreateErrorJson(404, "champion", `${req.query.name} is not the name of any champion`));
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
      for (let trait of traits) {
        retChamps = retChamps.filter(champion => {
          let lowerTraits = champion["traits"].map(trait => { return trait.toLowerCase(); });
          if (lowerTraits.includes(`set${setName}_${trait}`)) {
            return true;
          }
          return false;
        });
      }
    }
    return res.json(retChamps);
  });

  // Traits
  router.get(`/set${set}/traits`, function(req, res) {
    if (req.query.name) {
      for (let trait of traits) {
        let name = req.query.name.toLowerCase();
        if (trait["name"].toLowerCase() === name) {
          return res.json(trait);
        }
      }
      return res.status(404).json(CreateErrorJson(404, "trait", `${req.query.name} is not the name of any trait`)); 
    }

    let retTraits = [...traits];
    if (req.query.type) {
      let types = req.query.type.split(' ').map(type => { return type.toLowerCase(); });
      retTraits = retTraits.filter(trait => {
        for (let queryType of types) {
          if (trait["type"].toLowerCase() === queryType) {
            return true;
          }
        }
        return false;
      });
    }

    return res.json(retTraits)
  });

  // Items
  router.get(`/set${set}/items`, function(req, res) {
    if (req.query.id) {
      for (let item of items) {
        if (item["id"] === parseInt(req.query.id)) {
          return res.json(item);
        }
      }
      return res.status(404).json(CreateErrorJson(404, "item", `${req.query.id} is not the id of any item`)); 
    }

    if (req.query.name) {
      for (let item of items) {
        if (item["name"].toLowerCase() === req.query.name.toLowerCase()) {
          return res.json(item);
        }
      }
      return res.status(404).json(CreateErrorJson(404, "item", `${req.query.name} is not the name of any item`)); 
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

  // Images
  router.get(`/set${set}/imgs`, function(req, res) {
    if (req.query.champion) {
      for (let champion of champions) {
        let currChampion = champion["name"].toLowerCase();
        if (currChampion == req.query.champion.toLowerCase()) {
          return res.sendFile(`set${set}/champions/${champion["id"]}.png`, {"root": './sets/'});
        }
      }
      return res.status(404).json(CreateErrorJson(404, "champion", `${req.query.champion} is not the name of any champion`));
    }

    if (req.query.item) {
      for (let item of items) {
        let currItem = item;
        if (currItem["id"] === Number(req.query.item)) {
          return res.sendFile(`set${set}/items/${item["id"]}.png`, {"root": './sets/'});
        }
        else if (currItem["name"].toLowerCase() === req.query.item.toLowerCase()) {
          return res.sendFile(`set${set}/items/${item["id"]}.png`, {"root": './sets/'});
        }
      }
      return res.status(404).json(CreateErrorJson(404, "item", `${req.query.item} is not the id or name of any item`)); 
    }

    if (req.query.trait) {
      for (let trait of traits) {
        let currTrait = trait;
        if (currTrait["name"].toLowerCase() === req.query.trait.toLowerCase()) {
          return res.sendFile(`set${set}/traits/${trait["name"]}.svg`, {"root": './sets/'});
        }
      }
      return res.status(404).json(CreateErrorJson(404, "trait", `${req.query.trait} is not the name of any trait`)); 
    }

    return res.status(404).json(CreateErrorJson(404, "images", `No champion, trait, or item specified`));   
  });
});

module.exports = { router, CreateErrorJson };
