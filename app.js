const express = require("express");
const cors = require("cors");
const Datastore = require("nedb");
const readline = require("readline");
const path = require("path");
const fs = require("fs");
require("dotenv").config();
const QRCode = require("qrcode");

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
    const host = request.get("host");
    const url_api = `${request.protocol}://${host}/api`;
    const url_postsurvey = `${url_api}/${doc._id}`;

    doc.url_api = url_api;
    // save data in Google Spreadsheet
    const s = new PreSurvey();
    s.addRows(doc);

    // generate a QRCode based on the document id url

    const QRC = async (id) => {
      try {
        // const qrcode = await qrcode.toDataURL(url));
        await QRCode.toFile(`public/qrcodes/${id}.png`, url_postsurvey, {
          type: "png",
        });
      } catch (err) {
        console.error(err);
      }
    };
    QRC(doc._id);
    response.json({ status: "success" });
  });
});

app.get("/api/:id", (request, response) => {
  db.findOne(
    {
      _id: request.params.id,
    },
    (err, doc) => {
      if (err) {
        response.redirect(404, "/404.html");
      }
      response.redirect(200, `/postsurvey.html?id=${doc._id}`);
    }
  );
});

app.get("/api/delivering/:id", (request, response) => {});

app.get("/api", (request, response) => {
  db.find({}, (err, docs) => {
    if (err) {
      response.end({ status: "nothing here" });
      return;
    }
    const rs = {
      count: docs.length,
      docs,
    };
    response.json(rs);
  });
});
/* 
  Export database to a csv format 
*/
// app.get("/db2csv", (request, response) => {
//   const jsonfile = "../R_analysis/database.json";
//   let jsonlines = "";
//   let rl = readline.createInterface({
//     input: fs.createReadStream("database.db"),
//   });

//   // let line_no = 0;
//   rl.on("line", (line) => {
//     line = line.trim();
//     jsonlines += `${line},\n`;
//   });

//   rl.on("close", () => {
//     jsonlines = `[${jsonlines.slice(0, jsonlines.length - 2)}]`;
//     fs.writeFile(jsonfile, jsonlines, (err) => {
//       if (err) {
//         console.log("on close database", err);
//       }
//       response.json({
//         status: "success",
//         message: "Database exported!",
//       });
//     });
//   });
// });

// app.get("/", (request, response) => {
//   db.find({})
//     .sort({
//       year: -1,
//       city: 1,
//       name: 1,
//     })
//     .exec((err, docs) => {
//       if (err) {
//         response.end();
//         return;
//       }
//       const rs = {
//         count: docs.length,
//         total: docs.length,
//         page: 1,
//         docs,
//       };

//       response.render("list.pug", {
//         data: rs,
//       });
//     });
// });

/*
  Display a page with details of an Interactive Apparatus
*/
// app.get("/show/:id", (request, response) => {
//   db.findOne(
//     {
//       _id: request.params.id,
//     },
//     (err, doc) => {
//       response.render("show.pug", {
//         title: `Interactive Apparatus - ${doc.name}`,
//         doc,
//       });
//     }
//   );
// });

// /*
//   display the form to add a new Interactive Apparatus
// */
// app.get("/add", (request, response) => {
//   // doc = new Apparatus();
//   response.render("form.pug", {
//     doc: {},
//   });
// });

// /*
//   add a new Interactive Apparatus into the database
// */
// app.post("/new", (request, response) => {
//   const data = request.body;

//   // make sure we always have an array (even empty, for R statistics)
//   ["medium", "input", "output", "sociali", "museum"].forEach((elt) => {
//     if (!data[elt] || data[elt] === undefined) {
//       data[elt] = [];
//     }
//     if (typeof data[elt] === "string") {
//       data[elt] = [data[elt]];
//     }
//   });

//   // save data ind db and send back to the detail page
//   db.insert(data, (err, doc) => {
//     if (!err) response.redirect(`/show/${doc._id}`);
//   });
// });

// /*
//   edit an existing Interactive Apparatus
// */
// app.get("/edit/:id", (request, response) => {
//   db.findOne(
//     {
//       _id: request.params.id,
//     },
//     (err, doc) => {
//       response.render("form.pug", {
//         doc,
//       });
//     }
//   );
// });

// app.post("/update/:id", (request, response) => {
//   const data = request.body;

//   ["medium", "input", "output", "sociali", "museum"].forEach((elt) => {
//     if (typeof data[elt] === "string") {
//       data[elt] = [data[elt]];
//     }
//     if (!data[elt] || data[elt] === undefined) {
//       data[elt] = [];
//     }
//   });

//   db.findOne(
//     {
//       _id: request.params.id,
//     },
//     (err, doc) => {
//       let newDoc = {
//         ...doc,
//         ...data,
//       };
//       db.update(
//         {
//           _id: newDoc._id,
//         },
//         newDoc,
//         {},
//         (err, d) => {
//           response.redirect(`/show/${newDoc._id}`);
//         }
//       );
//     }
//   );
// });
