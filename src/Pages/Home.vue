<template>
  <div class="page">
    <div class="entry">
      <div class="error-message" v-if="this.errorMsg != null">
        {{this.errorMsg}}
      </div>
      <div class="number-fields">
        <div class="number-fields-inner">
          <input min="0" max="9" step="1" maxlength="1" type="number" ref="no0" @focus="ChangeCurrentRoomNumber(0)" @input="e => ChangeRoomNumber(0, parseFloat(e.target.value))"/>
          <input min="0" max="9" step="1" maxlength="1" type="number" ref="no1" @focus="ChangeCurrentRoomNumber(1)" @input="e => ChangeRoomNumber(1, parseFloat(e.target.value))"/>
          <input min="0" max="9" step="1" maxlength="1" type="number" ref="no2" @focus="ChangeCurrentRoomNumber(2)" @input="e => ChangeRoomNumber(2, parseFloat(e.target.value))"/>
          <input min="0" max="9" step="1" maxlength="1" type="number" ref="no3" @focus="ChangeCurrentRoomNumber(3)" @input="e => ChangeRoomNumber(3, parseFloat(e.target.value))"/>
        </div>
      </div>
      <div class="button-fields">
        <button :disabled="!canJoin" class="cta-button --large" type="submit" ref="submit" @click="Join">Join</button>
        <button :disabled="!canCreate" class="cta-button --large" type="submit" ref="submit" @click="Submit">Create</button>
      </div>
      <!-- <router-link to="room/1234">Room 1234</router-link> -->

    </div>
  </div>
</template>

<script>
export default {
  name : "Home",
  data(){
    return {
      currentNumber : 0,
      canJoin :false,
      canCreate:false,
      errorMsg:null,
      room : {
        0 : null,
        1 : null,
        2 : null,
        3 : null
      }
    }
  },
  mounted(){
    this.$refs["no"+ this.currentNumber].focus();
  },
  sockets:{
    "room-success" : function(d){
      this.$store.commit("room" , d.room);
      this.$router.push("/room/"+  d.room);


    },
    "room-error" : function(d){
      console.log("error data",  d);

      this.errorMsg = d.message;
    }
  },
  methods:{
    Join(){
      var roomNumber = this.GetRoomNumber();
      this.$socket.emit("join-room", {
        id: this.$socket.id,
        room : roomNumber
      });

    },
    Submit(){
      var roomNumber = this.GetRoomNumber();
      this.$socket.emit("create-room", {
        id: this.$socket.id,
        room : roomNumber
      });

      console.log("submit");
    },
    GetRoomNumber(){
      var roomID = Object.values(this.room).reduce((a,b) => a +""+ b);
      console.log("roomID " , roomID);

      
      return roomID; 
    },
    ChangeCurrentRoomNumber(number){
      this.currentNumber = number;
    },
    ChangeRoomNumber(roomNumber, number){

      if (number > 9){
        number = parseFloat(number.toString().slice(0, 1));

        this.$refs["no"+roomNumber].value = number;
      }

      this.room[roomNumber] = number;

      if(roomNumber < 3){
        this.currentNumber++;
        this.$refs["no" + this.currentNumber].focus();
      }else{
        this.$refs.submit.focus();  
      }

      
      var checker = Object.values(this.room).filter(o => o == null).length;
      if(checker == 0){
        this.canCreate = true;
        this.canJoin = true;
      }
    }
  }

}
</script>

<style scoped>
.page {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  background:#eee;
}

.entry {
  width: 400px;
  margin: auto;
  position: relative;
  background: #fff;
  padding:3rem;
  border-radius: 50px;
}

.number-fields {
  display: flex;
  margin-bottom: 1rem;
  position: relative;
}

.number-fields-inner {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: space-between;
}

.number-fields:before {
    content: '';
    display: block;
    width: 100%;
    padding-top: 30%;
  }

input[type="number"] {
  font-size: 3rem;
  display: inline-block;
  border: 1px solid #eee;
  border-radius: 15px;
  width: 20%;
  outline: 0;
  text-align: center;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type=number] {
  -moz-appearance: textfield;
}

.button-fields{
  display: flex;
}

.button-fields button:first-child{
  margin-right:1rem;
}

.button-fields button:last-child{
  margin-left:1rem;
}



</style>