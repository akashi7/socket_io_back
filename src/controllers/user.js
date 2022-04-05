const { db } = require('../config/database');

exports.getApi = (req, res) => {
  const { id } = req.user;
  let amount = 500;
  const date = new Date().toLocaleDateString();

  db.getConnection((err, connection) => {
    if (err) console.log("error", err);
    else {
      connection.query("INSERT INTO bills SET?", {
        user_id: id,
        amount,
        date
      }, (err, result) => {
        if (err) console.log("error", err);
        else {
          res.send({
            status: 200
          });
        }
        connection.release();
      });
    }
  });

};

exports.allbills = (req, res) => {
  const { id } = req.user;
  db.getConnection((err, connection) => {
    if (err) console.log("error", err);
    else {
      connection.query("SELECT * FROM bills WHERE user_id=?", [id], (err, result) => {
        console.log("res", result);
        if (err) console.log("error", err);
        else {
          res.send({
            status: 200,
            data: result
          });
        }
        connection.release();
      });
    }
  });
};


exports.createProject = (req, res) => {
  const { id, username } = req.user;
  const { projectName } = req.body;

  db.getConnection((err, connection) => {
    if (err) console.log("error", err);
    else {
      connection.query("SELECT * FROM projects WHERE project_name=? AND user_id=?", [projectName, id], (err, result) => {
        if (err) console.log("error", err);
        else if (result.length > 1) {
          res.send({
            status: 205,
            message: "You have this project name arleady"
          });
        }
        else {
          connection.query("INSERT INTO projects SET?", {
            user_id: id,
            project_name: projectName,
            username
          }, (err, resultss) => {
            if (err) console.log("error", err);
            else {
              res.send({
                status: 200,
                message: "Project Inserted"
              });
            }
            connection.release();
          });
        }
      });
    }
  });

};


exports.allProjects = (req, res) => {

  const { id } = req.user;

  db.getConnection((err, connection) => {
    if (err) console.log("error", err);
    else {
      connection.query("SELECT * FROM projects", (err, result) => {
        if (err) console.log("error", err);
        else {
          res.send({
            status: 200,
            data: result
          });
        }
        connection.release();
      });
    }
  });
};

exports.oneProject = (req, res) => {
  const { id } = req.query;

  db.getConnection((err, connection) => {
    if (err) console.log("error", err);
    else {
      connection.query("SELECT * FROM projects WHERE id=?", [id], (err, result) => {
        if (err) console.log("error", err);
        else {
          res.send({
            status: 200,
            data: result
          });
        }
        connection.release();
      });
    }
  });

};

exports.getRoomMessages = (req, res) => {
  const { roomId } = req.query;
  db.getConnection((err, connection) => {
    if (err) console.log("error", err);
    else {
      connection.query("SELECT * FROM messages WHERE chat_room=?", [roomId], (err, result) => {
        if (err) console.log("error", err);
        else {
          res.send({
            status: 200,
            data: result
          });
        }
        connection.release();
      });
    }
  });
};