var React=require("react");
var E=React.createElement;
var ksa=require("ksana-simple-api");
var DualFilter=require("ksana2015-dualfilter").Component;
var HTMLFileOpener=require("ksana2015-htmlfileopener").Component;

var db="moedict";
var styles={
  container:{display:"flex"}
  ,dualfilter:{flex:1,height:"100%",overflowY:"auto"}
  ,rightpanel:{flex:3}
  ,input:{fontSize:"100%",width:"100%"}
}
var maincomponent = React.createClass({
  getInitialState:function() {
    return {items:[],hits:[],itemclick:" ",text:"",q:"",uti:"",localmode:false,ready:false,
    tofind1:localStorage.getItem("tofind1")||"河$",q:localStorage.getItem("q")||"山東省"};
  }
  ,componentDidMount:function() {
    ksa.tryOpen(db,function(err){
      if (!err) {
        this.setState({ready:true});
      } else {
        this.setState({localmode:true});
      }
    }.bind(this));
  }
  ,onFilter:function(tofind1,q) {
    ksa.filter({db:db,regex:tofind1,q:q},function(err,items){
      localStorage.setItem("tofind1",tofind1);
      localStorage.setItem("q",q);
      this.setState({items:items,q:q,tofind1:tofind1},function(){
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
    return ksa.renderHits(this.state.text,this.state.hits,E.bind(null,"span"));
  }
  ,onFileReady:function(files) {
    this.setState({localmode:false,ready:true});
    db=files[db];//replace dbid with HTML File handle
  }
  ,renderOpenKDB:function() {
    if (!this.state.localmode)return <div>Loading {db}</div>;
    return <div>
      <h2>Dual Filter DEMO for Moedict</h2>
      <HTMLFileOpener onReady={this.onFileReady}/>
      <br/>Google Chrome Only
      <br/><a target="_new" href="https://github.com/ksanaforge/dualfilter-sample">Github Repo</a>
    </div>
  }
  ,render: function() {
    if (!this.state.ready) return this.renderOpenKDB();
    return <div style={styles.container}>    
      <div style={styles.dualfilter}>
        <DualFilter items={this.state.items} hits={this.state.hits}
          inputstyle={styles.input}
          tofind1={this.state.tofind1}
          tofind2={this.state.q}
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