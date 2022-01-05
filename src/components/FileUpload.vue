<template>
  <div :class="'row drag-active-' + isOnDrag" ref="uploadField">
    <label class="title">{{ title }}</label>
    <form>
      <div class="flex">
        <label class="width-12" :for="id">
          <template v-if="!uploading && !canAdvancedUpload && !uploadDone"
            >Datei auswählen</template
          >
          <template v-if="!uploading && canAdvancedUpload && !uploadDone"
            >Datei auswählen oder Drag & Drop</template
          >
          <template v-if="uploading">hochladen...</template>
          <template v-if="!uploading && uploadDone">Hochgeladen!</template>
        </label>
        <input
          :id="id"
          type="file"
          name="files"
          ref="fileField"
          class="fileUpload"
          :accept="acceptedTypes"
          @change="UploadFile"
        />
      </div>
    </form>
  </div>
</template>

<script>
//@group Components
// FileUpload
// Lade per Drag&Drop lokale Dateien auf den Server
export default {
  name: "FileUpload",
  props: {
    // Label
    title: {
      type: String,
      // ""
      default: "",
    },
    // Akzeptierte Dateiformate
    acceptedTypes: {
      type: String,
      // ".glb,.gltf"
      default: ".png,.jpg",
    },
  },
  data() {
    return {
      id: this.CreateGuid(),
      canAdvancedUpload: false,
      isOnDrag: false,
      droppedFiles: null,
      uploading: false,
      uploadDone: false,
    };
  },
  mounted() {
    this.canAdvancedUpload = this.CheckForAdvancedUpload();

    this.AddListeners();
  },
  methods: {
    CreateGuid() {
      function _p8(s) {
        var p = (Math.random().toString(16) + "000000000").substr(2, 8);
        return s ? "-" + p.substr(0, 4) + "-" + p.substr(4, 4) : p;
      }
      return _p8() + _p8(true) + _p8(true) + _p8();
    },
    AddListeners() {
      this.$refs.uploadField.addEventListener("dragover", (e) =>
        this.OnDrag(e, true)
      );
      this.$refs.uploadField.addEventListener("dragenter", (e) =>
        this.OnDrag(e, true)
      );

      this.$refs.uploadField.addEventListener("dragleave", (e) =>
        this.OnDrag(e, false)
      );
      this.$refs.uploadField.addEventListener("dragend", (e) =>
        this.OnDrag(e, false)
      );
      this.$refs.uploadField.addEventListener("drop", (e) =>
        this.OnDrag(e, false)
      );

      this.$refs.uploadField.addEventListener("drop", (e) => this.OnDrop(e));
    },
    OnDrag(e, boolean) {
      e.preventDefault();
      e.stopPropagation();

      this.isOnDrag = boolean;
    },
    OnDrop(e) {
      e.preventDefault();
      e.stopPropagation();
      this.droppedFiles = e.dataTransfer.files;

      this.TransferData(this.droppedFiles[0]);
      console.log(this.droppedFiles);
    },
    Preventer(e) {
      e.preventDefault();
      e.stopPropagation();
    },
    CheckForAdvancedUpload() {
      var div = document.createElement("div");
      return (
        ("draggable" in div || ("ondragstart" in div && "ondrop" in div)) &&
        "FormData" in window &&
        "FileReader" in window
      );
    },
    UploadFile(e) {
      e.preventDefault(e);

      if (this.$refs.fileField.files.length == 0) {
        return;
      }

      this.TransferData(this.$refs.fileField.files[0]);
    },

    TransferData(file) {
      this.uploading = true;

      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.$emit("fileUpload", reader.result);
      };
      reader.onerror = (error) => {
        console.log("Error: ", error);
      };
    },
  },
};
</script>
<style scoped>
label:not(.title) {
  cursor: pointer;
  padding: 1rem;
  background: #eee;
  display: block;
  border-radius: 15px;
  border: 2px dotted #ccc;
  transition-duration: 0.5s;
  transition-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1.275);
  background: #eee;
  color: #333;
  font-weight: 700;
  text-align: center;
}

.fileUpload {
  display: none;
}

.drag-active-true label.title{
  padding: 2rem;
}
</style>
