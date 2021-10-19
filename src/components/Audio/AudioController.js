/* eslint-disable no-prototype-builtins */
import AudioFiles from './AudioFiles';
class AudioController {
  constructor(store) {
    this.store = store;
    
    this.loaded = false;

    this.buffers = {};

    store.commit("SetAudioController", this);
    
  }

  EnableSounds = () => {
    this.context = new AudioContext();
    this.context.resume().then(() => {
      if (!this.loaded) {
        this.Init().catch(error => console.log(error));
      }
    });
  }

  Init() {
    //console.log(AudioFiles);
    var loadArray = [];

    Object.keys(AudioFiles).map((category) => {
      if (!this.buffers.hasOwnProperty(category)) {
        this.buffers[category] = {}
      }
      Object.keys(AudioFiles[category]).map(soundName => {

        this.buffers[category][soundName] = {
          promise: this.getFile(AudioFiles[category][soundName]),
          isPlaying: false,
          source: null,
          gainNode: null,
          loop: false,
          paused: false,
          volume: 1
        }

        loadArray.push(this.buffers[category][soundName]);

      });
    });

    return Promise.all(loadArray).then(buffers => {
      //console.log("Everything is loaded in audio" , buffers, this.buffers);
      this.loaded = true;

      return this.buffers;
    });

  }

  async getFile(filepath) {

    const response = await fetch(filepath);
    const arrayBuffer = await response.arrayBuffer();

    const audioBuffer = await this.context.decodeAudioData(arrayBuffer).catch(error => console.warn(filepath, error));
    return audioBuffer;

  }


  PlaySound = (name, loop = false, volume = 1.0) => {
    console.log("PLAY SOUND ",name)
    var [category, soundName] = name.split(".");
    if (this.store.state.mute) {
      volume = 0;
    }

    //falls noch nicht geladen ist ODER der sound bereits spielt
    if (!this.loaded || this.buffers[category][soundName].isPlaying) {
      return;
    }

    this.buffers[category][soundName].isPlaying = true;
    this.buffers[category][soundName].volume = volume;
    this.buffers[category][soundName].loop = loop;

    this.buffers[category][soundName].promise.then((buffer) => {
      this.buffers[category][soundName].source = this.context.createBufferSource(); // creates a sound source
      this.buffers[category][soundName].source.buffer = buffer;                    // tell the source which sound to play
      this.buffers[category][soundName].source.loop = loop;

      if (this.buffers[category][soundName].gainNode == null) {
        this.buffers[category][soundName].gainNode = this.context.createGain();
        this.buffers[category][soundName].gainNode.gain.value = volume;
        this.buffers[category][soundName].gainNode.connect(this.context.destination);
      } else {
        if (this.store.state.mute) {
          this.buffers[category][soundName].gainNode.gain.value = volume;
        } else {
          this.buffers[category][soundName].gainNode.gain.setTargetAtTime(volume, this.context.currentTime, .6);
        }
      }


      if (loop) {
        //connect sound mit gainnode
        this.buffers[category][soundName].source.connect(this.buffers[category][soundName].gainNode);

      } else {
        this.buffers[category][soundName].source.connect(this.buffers[category][soundName].gainNode);
      }


      //console.log("onended" , this.buffers[category][soundName].source.onended);
      if (this.buffers[category][soundName].source.onended == null) {
        this.buffers[category][soundName].source.onended = () => {
          this.buffers[category][soundName].isPlaying = false;
          //console.log("ended sound", this.buffers[category][soundName] );
        };
      }


      this.buffers[category][soundName].source.start(0);

    });
  }

  StopSound = (name) => {
    var [category, soundName] = name.split(".");
    //falls noch nicht geladen ist ODER der sound gar nicht spielt
    if (!this.loaded ||
      !this.buffers[category][soundName].isPlaying ||
      this.buffers[category][soundName].source == null) { return; }

      this.buffers[category][soundName].source.stop();
      this.buffers[category][soundName].isPlaying = false;
  }

  StopAll = () => {
    Object.keys(this.buffers).map(category => {
      Object.keys(this.buffers[category]).filter(sound => this.buffers[category][sound].isPlaying).map(sounds => {
        this.buffers[category][sounds].paused = true;
        this.StopSound(category + "." + sounds);
      });
    });
  }
  Resume = () => {

    //console.log("Resume");
    Object.keys(this.buffers).map(category => {
      Object.keys(this.buffers[category]).filter(sound => this.buffers[category][sound].paused && this.buffers[category][sound].loop).map(sounds => {
        //console.log(this.buffers[category][sounds]);
        this.buffers[category][sounds].paused = false;
        var volume = this.buffers[category][sounds].volume;
        this.PlaySound(category + "." + sounds, true, volume);
      });
    });
  }
}



export default AudioController;