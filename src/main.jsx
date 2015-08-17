var React=require("react");
var E=React.createElement;
var ksa=require("ksana-simple-api");
var DualFilter=require("ksana2015-dualfilter").Component;
var db="moedict";
var styles={
  container:{display:"flex"}
  ,dualfilter:{flex:1,height:"100%",overflowY:"auto"}
  ,rightpanel:{flex:2}
  ,input:{fontSize:"100%",width:"100%"}
}
var maincomponent = React.createClass({
  getInitialState:function() {
    return {items:[],hits:[],itemclick:" ",text:"",q:"",uti:"",localmode:false,ready:false};
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
    return ksa.renderHits(this.state.text,this.state.hits,E.bind(null,"span"));
  }
  ,openLocalFile:function(e) {
    db=e.target.files[0];
    this.setState({localmode:false,ready:true});
  }
  ,renderOpenKDB:function() {
    if (!this.state.localmode)return <div>Loading {db}</div>;
    return <div>
      <h2>Dual Filter DEMO for Moedict</h2>
      Click and select moedict.kdb <input type="file" accept=".kdb" onChange={this.openLocalFile}></input>
      <a href="http://ya.ksana.tw/kdb/moedict.kdb">Download Moedict.kdb</a> if you don't have it on local disk.
    </div>
  }
  ,render: function() {
    if (!this.state.ready) return this.renderOpenKDB();
    return <div style={styles.container}>    
      <div style={styles.dualfilter}>
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
        <br/><a target="_new" href="https://github.com/ksanaforge/dualfilter-sample">Github Repo</a>
      </div>
    </div>    
  }
});
module.exports=maincomponent;