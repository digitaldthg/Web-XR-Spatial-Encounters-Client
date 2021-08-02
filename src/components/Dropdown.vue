<template>
  <div class="input dropdown">
    <label :for="id">Next Theme</label>
    <div class="select-wrapper">
      <select :id="id" @change="OnChangeHandler">
        <option v-for="(opt, index) in options" v-bind:key="index" :value="opt">
          {{opt}}
        </option>
      </select>
    </div>
  </div>
</template>

<script>
export default {
  name: "Dropdown",
  data() {
    return {
      id: null,
      options: [],
      optionNames: [],
    };
  },
  mounted() {
    this.id = this._uid;
    this.options = this.$store.state.allThemes.map((t) => {
        return t.name;
      });
  },
  watch: {
    "$store.state.allThemes": function (themes) {
      console.log(themes);
      this.options = themes.map((t) => {
        return t.name;
      });
      console.log(
        themes.map((t) => {
          return t.name;
        })
      );
    },
  },
  methods: {

    OnChangeHandler(e) {
      var value = e.target.value;
      console.log("Dorpdown Value ",value);
      var next = this.$store.state.allThemes.find(t=>{return t.name == value})
      console.log("Next Theme ",next);
      this.$store.commit("setNextTheme", next)
    },
  },
};
</script>

<style lang="css">
.select-wrapper {
  position: relative;
}

.select-wrapper::after {
  content: "";
  display: block;
  width: 10px;
  height: 10px;
  position: absolute;
  top: 0;
  bottom: 0;
  right: 15px;
  margin: auto;
  border-bottom: 2px solid;
  border-right: 2px solid;
  transform: rotate(45deg) translateX(-2px);
  pointer-events: none;
}

select {
  -moz-appearance: none;
  -webkit-appearance: none;
  appearance: none;
  border: none;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.3);
  background: #fff;

  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  height: 40px;
  outline: none;
  padding-left: 10px;
  width: 100%;
  padding-right: 40px;
}

select::-ms-expand {
  display: none;
}

select:focus::-ms-value {
  background-color: transparent;
}
</style>