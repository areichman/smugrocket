// smugrocket 0.0.1 
// (c) 2013 Aaron Reichman 
// https://github.com/areichman/smugrocket.git 
var SmugRocket={Models:{},Collections:{},Views:{},Templates:{},Lib:{},initialize:function(){new SmugRocket.Router,Backbone.history.start()}};$(function(){SmugRocket.initialize(),console.log("SmugRocket started.")}),SmugRocket.Router=Backbone.Router.extend({transition:function(){},routes:{"":"home","!/":"home","!/login":"login"},home:function(){var a=new SmugRocket.Views.Home;SmugRocket.transition(a)},login:function(){var a=new SmugRocket.Views.Login;SmugRocket.transition(a)}});