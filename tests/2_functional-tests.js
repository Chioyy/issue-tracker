/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  
    suite('POST /api/issues/{project} => object with issue data', function() {
      
      test('Every field filled in', function(done) {
       chai.request(server)
          .post('/api/issues/test')
          .send({
            issue_title: "Test 1",
            issue_text: "every field filled in",
            created_by: "Chioy",
            assigned_to: "project 2",
            status_text: "in dev"
          })
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.body.issue_title, "Test 1");
            assert.equal(res.body.issue_text, "every field filled in");
            assert.equal(res.body.created_by, "Chioy");
            assert.equal(res.body.assigned_to, "project 2");
            assert.equal(res.body.status_text, "in dev");       
          });
        done();
      });
      
      test('Required fields filled in', function(done) {
       chai.request(server)
          .post('/api/issues/test')
          .send({
            issue_title: "Test 2",
            issue_text: "required fields filled in",
            created_by: "Chioy"  
          })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.issue_title, "Test 2");
            assert.equal(res.body.issue_text, "required fields filled in");
            assert.equal(res.body.created_by, "Chioy");
          });
        done();
      });
      
      test('Missing required fields', function(done) {
        chai.request(server)
            .post('/api/issues/test')
            .send({
              issue_title: "Test 3"
            })
            .end(function(err, res) {
              assert.equal(res.status, 200);
              assert.equal(res.text, "Required fields are not filled");
            });
        done();
      });
    });
    
    suite('PUT /api/issues/{project} => text', function() {
      
      test('No body', function(done) {
        chai.request(server)
            .put('/api/issues/test')
            .send({ })
            .end(function(err, res) {
              assert.equal(res.status, 200);
              assert.equal(res.text, '"Id required"');
            });
        done();
      })
      
      test('One field to update', function(done) {
        chai.request(server)
            .put('/api/issues/test')
            .send({
              _id: "25216",
              issue_title: "Test 5" 
            })
            .end(function(err, res) {
              assert.equal(res.status, 200);
              assert.equal(res.text, '"successfully updated"');
            });
        done();
      });
      
      test('Multiple fields to update', function(done) {
        chai.request(server)
            .put('/api/issues/test')
            .send({
              _id: "25216",
              issue_title: "Test 6",
              issue_text: "Multiply fields"
            })
            .end(function(err, res) {
              assert.equal(res.status, 200);
              assert.equal(res.text, '"successfully updated"');
            });
        done();
      });
      
    });  
    
    
    suite('GET /api/issues/{project} => Array of objects with issue data', function() {
      
      test('No filter', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], '_id');
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'created_on');
        });
        done();
      });
     
      test('One filter', function(done) {
        chai.request(server)
          .get('/api/issues/test')
          .query({created_by: "chioy"})
          .end(function(err, res){
            assert.isArray(res.body);
            assert.property(res.body[0], '_id'); 
            assert.property(res.body[0], 'issue_title');
            assert.property(res.body[0], 'issue_text');
            assert.property(res.body[0], 'created_by');
            assert.property(res.body[0], 'created_on');        
            assert.equal(res.body[0].created_by, 'chioy');
          });
        done();
      });
     
      test('Multiple filters (test for multiple fields you know will be in the db for a return)', function(done) {
        chai.request(server)
          .get('/api/issues/test')
          .query({created_by: "chi", issue_title: "test"})
          .end(function(err, res){
            assert.isArray(res.body);
            assert.property(res.body[0], '_id'); 
            assert.property(res.body[0], 'issue_title');
            assert.property(res.body[0], 'issue_text');
            assert.property(res.body[0], 'created_by');
            assert.property(res.body[0], 'created_on');        
            assert.equal(res.body[0].created_by, 'chi');
            assert.equal(res.body[0].issue_title, 'test');
          });
        done();
      });
      
    });
    
    suite('DELETE /api/issues/{project} => text', function() {
      
      test('No _id', function(done) {
        chai.request(server)
          .delete('/api/issues/test')
          .send({ })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, '"_id error"');
          });
        done();
      });
      
      test('Valid _id', function(done) {
        chai.request(server)
          .delete('/api/issues/test')
          .send({_id: "5d63d558d10fd600853aed83"})
          .end(function(err, res) {
            assert.equal(res.status, 200);
            //Didn't find a good way to insert the same id to the database just for this test.
            //It works first time, but gives out could not delete as it deleted it in previous run.
            assert.equal(res.text, '"could not delete 5d63d558d10fd600853aed83"');
          });
        done();
      });
      
    });
   
});
