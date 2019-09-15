/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb');
var ObjectId = require('mongodb').ObjectID;

const CONNECTION_STRING = process.env.DB;

module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      let project = req.params.project; 
      const MongoClient = require('mongodb').MongoClient;
      const client = new MongoClient(CONNECTION_STRING, { useNewUrlParser: true });
      client.connect(err => {
        const collection = client.db("issuetracker").collection("issues");
        collection.find(req.query).sort({updated_on: -1}).toArray((err, info) => {
          if (err) return (err);
          else res.json(info);
        });
        client.close();  
      })
    })

    .post(function (req, res){
      let project = req.params.project;
      if(req.body.issue_title == null || req.body.issue_text == null || req.body.created_by == null)
        return res.send('Required fields are not filled');
      let newId = (typeof req.body._id == "string") ? req.body._id : Math.floor(Math.random() * 100000).toString();
    
      const MongoClient = require('mongodb').MongoClient;
      const client = new MongoClient(CONNECTION_STRING, { useNewUrlParser: true });
      client.connect(err => {
        const collection = client.db("issuetracker").collection("issues");
        collection.insertOne({
          _id: newId,
          issue_title: req.body.issue_title,
          issue_text: req.body.issue_text,
          created_by: req.body.created_by,
          assigned_to: req.body.assigned_to || "",
          status_text: req.body.status_text || "",
          created_on: new Date(),
          updated_on: new Date(),
          open: true,
          }, (err, info) => {
            if (err) return res.json("error, saving to database");
            return res.json(info.ops[0]);
          });
        client.close(); 
      });
    })
   
    .put(function (req, res){
      var project = req.params.project;
      if(!req.body._id)
        return res.json("Id required");
      if(req.body.issue_title == null && req.body.issue_text == null && req.body.created_by == null && req.body.assigned_to == null && req.body.status_text == null)
        return res.json('no updated field sent');
      let realId = "";
      typeof req.body._id == undefined ? realId = ObjectId(req.body._id) : realId = req.body._id;
  
      const MongoClient = require('mongodb').MongoClient;      
      const client = new MongoClient(CONNECTION_STRING, { useNewUrlParser: true });
      client.connect(err => {
        const collection = client.db("issuetracker").collection("issues");
        
        collection.findOne({_id: realId}, (err, data) => {
		      if (err) { 
			      return (err);
		      }
          if (data == null || data._id != realId) {
            return res.json("Invalid id");
          }
          else { 
            collection.updateOne(
              { _id: data._id },
              {$set: 
              { issue_title: (typeof req.body.issue_title == undefined) ? data.issue_title : req.body.issue_title,
                 issue_text: (typeof req.body.issue_text  == undefined) ? data.issue_text  : req.body.issue_text,
                 created_by: (typeof req.body.created_by  == undefined) ? data.created_by  : req.body.created_by,
                assigned_to: (typeof req.body.assigned_to == undefined) ? data.assigned_to : req.body.assigned_to,
                status_text: (typeof req.body.status_text == undefined) ? data.status_text : req.body.status_text,
                 updated_on: new Date()
              }}, (err, info) => {
                if (err) 
                  return err;
                if (info.result.nModified >= 1) 
                  return res.json('successfully updated');
                else 
                  return res.json('could not update ' + realId);
            });
            client.close();       
          }
        })          
      });  
    })
  
    .delete(function (req, res){
      var project = req.params.project;
      if(!req.body._id)
        return res.json("_id error");
    
      const MongoClient = require('mongodb').MongoClient;
      const client = new MongoClient(CONNECTION_STRING, { useNewUrlParser: true });
      client.connect(err => {
        const collection = client.db("issuetracker").collection("issues");
        collection.findOne({_id: ObjectId(req.body._id)}, (err, data) => {
		      if (err) return (err);
          if (data == null || data._id != req.body._id) {
            return res.json("could not delete " + req.body._id);
          }
          else {
            collection.deleteOne({ _id: data._id }, function(err, obj) {
              if (err) return err;
              return res.json("deleted " + req.body._id);
            });
          }                       
        });
      });
      client.close();    
   });
};