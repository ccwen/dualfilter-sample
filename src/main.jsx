var React=require("react");
var E=React.createElement;
var ksa=require("ksana-simple-api");
var DualFilter=require("ksana2015-dualfilter").Component;
var db="moedict";
var styles={
  container:{display:"flex"}
  ,leftpanel:{flex:1,height:"100%",overflowY:"auto"}
  ,rightpanel:{flex:2}
  ,input:{fontSize:"100%",width:"100%"}
}
var maincomponent = React.createClass({
  getInitialState:function() {
    return {items:[],hits:[],itemclick:" ",text:"",q:"",uti:""};
  }
  ,onFilter:function(tofind1,tofind2) {
    ksa.filter({db:db,regex:tofind1,q:tofind2},function(err,items,hits){
      this.setState({items:items,hits:hits,q:tofind2},function(){
        this.fetchText(items[0]);
      }.bind(this));

    }.bind(this));
  }
  ,fetchText:function(uti){
    ksa.fetch({db:db,uti:uti,q:this.state.q},function(err,content){
      if (!content || !content.length) return;
      this.setState({uti:uti,text:content[0].text,hits:content[0].hits});  
    }.bind(this));
  }
  ,onItemClick:function(e) {
    this.fetchText(e.target.innerHTML);
  }
  ,renderText:function() {
    var func=E.bind(null,"span");
    return ksa.renderHits(this.state.text,this.state.hits,func);
  }
  ,render: function() {
    return <div style={styles.container}>
      <div style={styles.leftpanel}>
        <DualFilter items={this.state.items} hits={this.state.hits}
          inputstyle={styles.input}
          tofind1="族$"
          tofind2="少數"
          onItemClick={this.onItemClick}
          onFilter={this.onFilter} />
      </div>
      <div style={styles.rightpanel}>
        <h2>{this.state.uti}</h2>
        {this.renderText()}
      </div>
      </div>
  }
});
module.exports=maincomponent;