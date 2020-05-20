const express = require("express");
const cors = require("cors");
const Datastore = require("nedb");
const readline = require("readline");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const { PreSurvey } = require("./googleSheetsService");

const app = express();
app.use(cors());
app.use(express.static("public"));
app.use(
  express.json({
    limit: "1mb",
  })
);
app.use(
  express.urlencoded({
    extended: true,
  })
);

const db = new Datastore({
  filename: "database.db",
  timestampData: true,
});
db.loadDatabase();

const port = process.env.PORT || 8082;
app.listen(port, () => console.log(`Server running on port ${port}`));

// Create a new document in database
app.post("/api", (request, response) => {
  const data = request.body;

  // make sure we always have an array
  ["q10"].forEach((elt) => {
    if (typeof data[elt] === "string") {
      data[elt] = [data[elt]];
    }
    if (!data[elt] || data[elt] === undefined) {
      data[elt] = [];
    }
  });

  // save data ind db
  db.insert(data, (err, doc) => {
    // save data in Google Spreadsheet
    const s = new PreSurvey();
    s.addRows(doc);
  });

  response.json({ status: "success" });
});

/* 
  Export database to a csv format 
*/
app.get("/db2csv", (request, response) => {
  const jsonfile = "../R_analysis/database.json";
  let jsonlines = "";
  let rl = readline.createInterface({
    input: fs.createReadStream("database.db"),
  });

  // let line_no = 0;
  rl.on("line", (line) => {
    line = line.trim();
    jsonlines += `${line},\n`;
  });

  rl.on("close", () => {
    jsonlines = `[${jsonlines.slice(0, jsonlines.length - 2)}]`;
    fs.writeFile(jsonfile, jsonlines, (err) => {
      if (err) {
        console.log("on close database", err);
      }
      response.json({
        status: "success",
        message: "Database exported!",
      });
    });
  });
});

app.get("/", (request, response) => {
  db.find({})
    .sort({
      year: -1,
      city: 1,
      name: 1,
    })
    .exec((err, docs) => {
      if (err) {
        response.end();
        return;
      }
      const rs = {
        count: docs.length,
        total: docs.length,
        page: 1,
        docs,
      };

      response.render("list.pug", {
        data: rs,
      });
    });
});

app.get("/api", (request, response) => {
  const filters = request.query;
  const find = {};
  let total = 0;

  // Sorting
  const sort = {};
  const field = filters["sort"] ? filters["sort"] : "createdAt";
  const order = filters["order"] ? filters["order"] : -1;
  sort[field] = order;

  // Pagination
  const skip = filters["skip"] ? filters["skip"] : 0;
  const limit = filters["limit"] ? filters["limit"] : 0;

  // search specific field
  const fieldname = filters["field"];
  const fieldvalue = filters["value"];
  if (fieldname && fieldvalue) {
    find[fieldname] = fieldvalue;
  }

  // Search keywords
  const search = filters["search"] ? filters["search"] : "";
  if (search) {
    find["$where"] = function () {
      const obj = this;
      const keys = [
        "name",
        "year",
        "place",
        "country",
        "typeofplace",
        "type",
        "interactivity",
      ];
      let result = false;
      keys.forEach((elt) => {
        const rs = obj[elt] ? obj[elt].includes(search) : false;
        if (rs) {
          result = true;
          return rs;
        }
      });
      return result;
    };
  }

  // total number
  db.count(find, (err, tt) => {
    total = tt;
  });

  db.find(find)
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .exec((err, docs) => {
      if (err) {
        response.end();
        return;
      }
      const rs = {
        count: docs.length,
        total,
        page: skip + 1,
        docs,
      };
      response.json(rs);
    });
});

app.get("/api/:id", (request, response) => {
  db.findOne(
    {
      _id: request.params.id,
    },
    (err, doc) => {
      response.json(doc);
    }
  );
});

/*
  Display a page with details of an Interactive Apparatus
*/
app.get("/show/:id", (request, response) => {
  db.findOne(
    {
      _id: request.params.id,
    },
    (err, doc) => {
      response.render("show.pug", {
        title: `Interactive Apparatus - ${doc.name}`,
        doc,
      });
    }
  );
});

/*
  display the form to add a new Interactive Apparatus
*/
app.get("/add", (request, response) => {
  // doc = new Apparatus();
  response.render("form.pug", {
    doc: {},
  });
});

/*
  add a new Interactive Apparatus into the database
*/
app.post("/new", (request, response) => {
  const data = request.body;

  // make sure we always have an array (even empty, for R statistics)
  ["medium", "input", "output", "sociali", "museum"].forEach((elt) => {
    if (!data[elt] || data[elt] === undefined) {
      data[elt] = [];
    }
    if (typeof data[elt] === "string") {
      data[elt] = [data[elt]];
    }
  });

  // save data ind db and send back to the detail page
  db.insert(data, (err, doc) => {
    if (!err) response.redirect(`/show/${doc._id}`);
  });
});

/*
  edit an existing Interactive Apparatus
*/
app.get("/edit/:id", (request, response) => {
  db.findOne(
    {
      _id: request.params.id,
    },
    (err, doc) => {
      response.render("form.pug", {
        doc,
      });
    }
  );
});

app.post("/update/:id", (request, response) => {
  const data = request.body;

  ["medium", "input", "output", "sociali", "museum"].forEach((elt) => {
    if (typeof data[elt] === "string") {
      data[elt] = [data[elt]];
    }
    if (!data[elt] || data[elt] === undefined) {
      data[elt] = [];
    }
  });

  db.findOne(
    {
      _id: request.params.id,
    },
    (err, doc) => {
      let newDoc = {
        ...doc,
        ...data,
      };
      db.update(
        {
          _id: newDoc._id,
        },
        newDoc,
        {},
        (err, d) => {
          response.redirect(`/show/${newDoc._id}`);
        }
      );
    }
  );
});
