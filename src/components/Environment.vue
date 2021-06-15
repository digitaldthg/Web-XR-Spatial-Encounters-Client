<template>
  
</template>
<script>
export default {
  name : "Environment",
  data(){
    return {
      ready : false
    }
  },
  watch:{
    "$store.state.xr" : function(xr){
      if(typeof(xr) === "undefined"){return;}

      this.ready = true;
    }
  },
  sockets : {
    "server-environment-update": function(data){
      console.log(data);
    }
  }
}
</script>