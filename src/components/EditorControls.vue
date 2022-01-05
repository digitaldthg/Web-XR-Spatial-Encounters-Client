<template>
  <div class="grid-1 info-panel">

    <div class="panel">
      <label>Theme Name</label>
      <input v-model="name" />
    </div>
    <!--
  Floor Texture
-->
    <div class="panel flex">
      <div class="panel-inner">
        <label>Floor Texture</label>
        <FileUpload
          v-if="tex_floor == null"
          @fileUpload="(file) => HandleImageUpload('tex_floor', file)"
        />
        <div class="image" v-if="tex_floor != null">
          <img :src="tex_floor" />
          <button @click="DeleteImage('tex_floor')"></button>
        </div>
      </div>
      <div class="panel-inner">
        <label>Tiling</label>
        <div class="flex">
          <input
            type="number"
            v-model.number="tex_floor_x"
            @input="
              (value) =>
                HandleImageTiling('tex_floor', tex_floor_x, tex_floor_y)
            "
          />
          <input
            type="number"
            v-model.number="tex_floor_y"
            @input="
              (value) =>
                HandleImageTiling('tex_floor', tex_floor_x, tex_floor_y)
            "
          />
        </div>
        <label>Offset</label>
        <div class="flex">
          <input
            type="number"
            min="0" max="1" step=".01"
            v-model.number="tex_floor_offset_x"
            @input="
              (value) =>
                HandleImageOffset('tex_floor', tex_floor_offset_x, tex_floor_offset_y)
            "
          />
          <input
            type="number"
            min="0" max="1" step=".01"
            v-model.number="tex_floor_offset_y"
            @input="
              (value) =>
                HandleImageOffset('tex_floor', tex_floor_offset_x, tex_floor_offset_y)
            "
          />
        
        </div>
      </div>
    </div>

    <!--
  Skybox Texture
-->
    <div class="panel flex">
      <div class="panel-inner">
      <label>Skybox Texture</label>
      <FileUpload
        v-if="tex_skybox == null"
        @fileUpload="(file) => HandleImageUpload('tex_skybox', file)"
      />
        <div class="image" v-if="tex_skybox != null">
          <img :src="tex_skybox" />
          <button @click="DeleteImage('tex_skybox')"></button>
        </div>
      </div>
      <div class="panel-inner">
      <label>Tiling</label>
      <div class="flex">
        <input
          type="number"
          v-model.number="tex_skybox_x"
          @input="
            (value) => HandleImageTiling('tex_skybox', tex_skybox_x, tex_skybox_y)
          "
        />
        <input
          type="number"
          v-model.number="tex_skybox_y"
          @input="
            (value) => HandleImageTiling('tex_skybox', tex_skybox_x, tex_skybox_y)
          "
        />
      </div>
      <label>Offset</label>
        <div class="flex">
          <input
            type="number"
            min="0" max="1" step=".01"
            v-model.number="tex_skybox_offset_x"
            @input="
              (value) =>
                HandleImageOffset('tex_skybox', tex_skybox_offset_x, tex_skybox_offset_y)
            "
          />
          <input
            type="number"
            min="0" max="1" step=".01"
            v-model.number="tex_skybox_offset_y"
            @input="
              (value) =>
                HandleImageOffset('tex_skybox', tex_skybox_offset_x, tex_skybox_offset_y)
            "
          />
        
        </div>
    </div>
    </div>

    <!--
  Background Front Texture
-->
    <div class="panel flex">
      <div class="panel-inner">
        <label>Background Front</label>
        <FileUpload
          v-if="tex_bg_front == null"
          @fileUpload="(file) => HandleImageUpload('tex_bg_front', file)"
        />
        <div class="image" v-if="tex_bg_front != null">
          <img :src="tex_bg_front"/>
          <button @click="DeleteImage('tex_bg_front')"></button>
        </div>
      </div>
      <div class="panel-inner">
        <label>Tiling</label>
        <div class="flex">
        <input
          type="number"
          v-model.number="tex_bg_front_x"
          @input="
            (value) =>
              HandleImageTiling('tex_bg_front', tex_bg_front_x, tex_bg_front_y)
          "
        />
        <input
          type="number"
          v-model.number="tex_bg_front_y"
          @input="
            (value) =>
              HandleImageTiling('tex_bg_front', tex_bg_front_x, tex_bg_front_y)
          "
        />
      </div>
      <label>Offset</label>
        <div class="flex">
          <input
            type="number"
            min="0" max="1" step=".01"
            v-model.number="tex_bg_front_offset_x"
            @input="
              (value) =>
                HandleImageOffset('tex_bg_front', tex_bg_front_offset_x, tex_bg_front_offset_y)
            "
          />
          <input
            type="number"
            min="0" max="1" step=".01"
            v-model.number="tex_bg_front_offset_y"
            @input="
              (value) =>
                HandleImageOffset('tex_bg_front', tex_bg_front_offset_x, tex_bg_front_offset_y)
            "
          />
        
        </div>
      </div>
    </div>

    <!--
  Background Back Texture
-->
    <div class="panel flex">
      <div class="panel-inner">
        <label>Background Back</label>
        <FileUpload
          v-if="tex_bg_back == null"
          @fileUpload="(file) => HandleImageUpload('tex_bg_back', file)"
        />
        <div class="image" v-if="tex_bg_back != null">
          <img :src="tex_bg_back" />
          <button @click="DeleteImage('tex_bg_back')"></button>
        </div>
      </div>
      <div class="panel-inner">
        <label>Tiling</label>
        <div class="flex">
        <input
          type="number"
          v-model.number="tex_bg_back_x"
          @input="
            (value) =>
              HandleImageTiling('tex_bg_back', tex_bg_back_x, tex_bg_back_y)
          "
        />
        <input
          type="number"
          v-model.number="tex_bg_back_y"
          @input="
            (value) =>
              HandleImageTiling('tex_bg_back', tex_bg_back_x, tex_bg_back_y)
          "
        />
      </div>
      <label>Offset</label>
        <div class="flex">
          <input
            type="number"
            min="0" max="1" step=".01"
            v-model.number="tex_bg_back_offset_x"
            @input="
              (value) =>
                HandleImageOffset('tex_bg_back', tex_bg_back_offset_x, tex_bg_back_offset_y)
            "
          />
          <input
            type="number"
            min="0" max="1" step=".01"
            v-model.number="tex_bg_back_offset_y"
            @input="
              (value) =>
                HandleImageOffset('tex_bg_back', tex_bg_back_offset_x, tex_bg_back_offset_y)
            "
          />
        
        </div>
      </div>
    </div>

    <!--
  Background moving Texture
-->
    <div class="panel flex">
      <div class="panel-inner">
        <label>Background Moving</label>
        <FileUpload
           v-if="tex_bg_moving == null"
          @fileUpload="(file) => HandleImageUpload('tex_bg_moving', file)"
        />
        <div class="image" v-if="tex_bg_moving != null">
          <img :src="tex_bg_moving" />
          <button @click="DeleteImage('tex_bg_moving')"></button>
        </div>
      </div>
      <div class="panel-inner">
        <label>Tiling</label>
        <div class="flex">
        <input
          type="number"
          v-model.number="tex_bg_moving_x"
          @input="(value) => HandleImageTiling('tex_bg_moving',tex_bg_moving_x,tex_bg_moving_y)"
        />
        <input
          type="number"
          v-model.number="tex_bg_moving_y"
          @input="(value) => HandleImageTiling('tex_bg_moving',tex_bg_moving_x,tex_bg_moving_y)"
        />
      </div>
      <label>Offset</label>
        <div class="flex">
          <input
            type="number"
            min="0" max="1" step=".01"
            v-model.number="tex_bg_moving_offset_x"
            @input="
              (value) =>
                HandleImageOffset('tex_bg_moving', tex_bg_moving_offset_x, tex_bg_moving_offset_y)
            "
          />
          <input
            type="number"
            min="0" max="1" step=".01"
            v-model.number="tex_bg_moving_offset_y"
            @input="
              (value) =>
                HandleImageOffset('tex_bg_moving', tex_bg_moving_offset_x, tex_bg_moving_offset_y)
            "
          />
        
        </div>
      </div>
    </div>

    <!--
  Guardian Texture
-->
    <div class="panel flex">
      <div class="panel-inner">
        <label>Guardian Texture</label>
        <FileUpload
          v-if="tex_guardian == null"
          @fileUpload="(file) => HandleImageUpload('tex_guardian', file)"
        />
        <div class="image" v-if="tex_guardian != null">
          <img :src="tex_guardian" />
          <button @click="DeleteImage('tex_guardian')"></button>
        </div>
      </div>
      <div class="panel-inner">
        <label>Tiling</label>
        <div class="flex">
        <input
          type="number"
          v-model.number="tex_guardian_x"
          @input="
            (value) =>
              HandleImageTiling('tex_guardian', tex_guardian_x, tex_guardian_y)
          "
        />
        <input
          type="number"
          v-model.number="tex_guardian_y"
          @input="
            (value) =>
              HandleImageTiling('tex_guardian', tex_guardian_x, tex_guardian_y)
          "
        />
      </div>
      <label>Offset</label>
        <div class="flex">
          <input
            type="number"
            min="0" max="1" step=".01"
            v-model.number="tex_guardian_offset_x"
            @input="
              (value) =>
                HandleImageOffset('tex_guardian', tex_guardian_offset_x, tex_guardian_offset_y)
            "
          />
          <input
            type="number"
            min="0" max="1" step=".01"
            v-model.number="tex_guardian_offset_y"
            @input="
              (value) =>
                HandleImageOffset('tex_guardian', tex_guardian_offset_x, tex_guardian_offset_y)
            "
          />
        
        </div>
      </div>
    </div>

    <!--
  Skybox Texture
-->
    <div class="panel flex">
      <div class="panel-inner">
        <label>Sun Texture</label>
        <FileUpload
          v-if="tex_sun == null"
          @fileUpload="(file) => HandleImageUpload('tex_sun', file)"
        />
        <div class="image" v-if="tex_sun != null">
          <img :src="tex_sun"/>
          <button @click="DeleteImage('tex_sun')"></button>
        </div>
      </div>
      <div class="panel-inner">
        <label>Tiling</label>
        <div class="flex">
        <input
          type="number"
          v-model.number="tex_sun_x"
          @input="
            (value) =>
              HandleImageTiling('tex_sun', tex_sun_x, tex_sun_y)
          "
        />
        <input
          type="number"
          v-model.number="tex_sun_y"
          @input="
            (value) =>
              HandleImageTiling('tex_sun', tex_sun_x, tex_sun_y)
          "
        />
      </div>
      <label>Offset</label>
        <div class="flex">
          <input
            type="number"
            min="0" max="1" step=".01"
            v-model.number="tex_sun_offset_x"
            @input="
              (value) =>
                HandleImageOffset('tex_sun', tex_sun_offset_x, tex_sun_offset_y)
            "
          />
          <input
            type="number"
            min="0" max="1" step=".01"
            v-model.number="tex_sun_offset_y"
            @input="
              (value) =>
                HandleImageOffset('tex_sun', tex_sun_offset_x, tex_sun_offset_y)
            "
          />
        
        </div>
      </div>
    </div>

    <div class="panel">
      <label>Fog Color</label>
      <v-input-colorpicker
        v-model="fog_color"
        @input="HandleSettingsChange"
        @change="HandleSettingsChange"
      />
      {{ fog_color }}
    </div>

    <div class="panel">
      <label>Triangle Colors</label>
      <v-input-colorpicker v-model="triangle_colors_1" />
      <v-input-colorpicker v-model="triangle_colors_2" />
      <v-input-colorpicker v-model="triangle_colors_3" /><br />

      <v-input-colorpicker v-model="triangle_colors_4" />
      <v-input-colorpicker v-model="triangle_colors_5" />
      <v-input-colorpicker v-model="triangle_colors_6" /><br />

      <v-input-colorpicker v-model="triangle_colors_7" />
      <v-input-colorpicker v-model="triangle_colors_8" />
      <v-input-colorpicker v-model="triangle_colors_9" />
    </div>
    <div class="panel">
      <label>Triangle Color Bottom</label>
      <v-input-colorpicker v-model="triangle_color_bottom" />
    </div>

    <!-- 
  Gradient Skybox Color
-->
    <div class="panel">
      <label>Gradient Skybox Color</label>
      <div class="flex width-12">
        <v-input-colorpicker
          v-model="gradient_skybox_color_1"
          @input="HandleSettingsChange"
          @change="HandleSettingsChange"
        />
        <div class="range-slider flex width-12">
          <input
            min="0"
            max="1"
            step="0.01"
            type="range"
            v-model="gradient_skybox_stop_1"
            @input="HandleSettingsChange"
            @change="HandleSettingsChange"
          /><span class="value-label">{{ gradient_skybox_stop_1 }}</span>
        </div>
      </div>

      <div class="flex width-12">
        <v-input-colorpicker
          v-model="gradient_skybox_color_2"
          @input="HandleSettingsChange"
          @change="HandleSettingsChange"
        />
        <div class="range-slider flex width-12">
          <input
            min="0"
            max="1"
            step="0.01"
            type="range"
            v-model="gradient_skybox_stop_2"
            @input="HandleSettingsChange"
            @change="HandleSettingsChange"
          /><span class="value-label">{{ gradient_skybox_stop_2 }}</span>
        </div>
      </div>

      <div class="flex width-12">
        <v-input-colorpicker
          v-model="gradient_skybox_color_3"
          @input="HandleSettingsChange"
          @change="HandleSettingsChange"
        />
        <div class="range-slider flex width-12">
          <input
            min="0"
            max="1"
            step="0.01"
            type="range"
            v-model="gradient_skybox_stop_3"
            @input="HandleSettingsChange"
            @change="HandleSettingsChange"
          /><span class="value-label">{{ gradient_skybox_stop_3 }}</span>
        </div>
      </div>

      <div class="flex width-12">
        <v-input-colorpicker
          v-model="gradient_skybox_color_4"
          @input="HandleSettingsChange"
          @change="HandleSettingsChange"
        />
        <div class="range-slider flex width-12">
          <input
            min="0"
            max="1"
            step="0.01"
            type="range"
            v-model="gradient_skybox_stop_4"
            @input="HandleSettingsChange"
            @change="HandleSettingsChange"
          /><span class="value-label">{{ gradient_skybox_stop_4 }}</span>
        </div>
      </div>
    </div>

    <!-- 
  Gradient Sun Color
-->
    <div class="panel">
      <label>Gradient Sun Color</label>
      <div class="flex width-12">
        <v-input-colorpicker
          v-model="gradient_sun_color_1"
          @input="HandleSettingsChange"
          @change="HandleSettingsChange"
        />
        <div class="range-slider flex width-12">
          <input
            min="0"
            max="1"
            step="0.01"
            type="range"
            v-model="gradient_sun_stop_1"
            @input="HandleSettingsChange"
            @change="HandleSettingsChange"
          /><span class="value-label">{{ gradient_sun_stop_1 }}</span>
        </div>
      </div>

      <div class="flex width-12">
        <v-input-colorpicker
          v-model="gradient_sun_color_2"
          @input="HandleSettingsChange"
          @change="HandleSettingsChange"
        />
        <div class="range-slider flex width-12">
          <input
            min="0"
            max="1"
            step="0.01"
            type="range"
            v-model="gradient_sun_stop_2"
            @input="HandleSettingsChange"
            @change="HandleSettingsChange"
          /><span class="value-label">{{ gradient_sun_stop_2 }}</span>
        </div>
      </div>
    </div>
    <div class="panel">
      <label>Base Floor</label>
      <div class="flex width-12">
        <v-input-colorpicker
          v-model="base_floor_color"
          @input="HandleSettingsChange"
          @change="HandleSettingsChange"
        />
        <div class="range-slider flex width-12">
          <input
            min="0"
            max="1"
            step="0.01"
            type="range"
            v-model="base_floor_stop"
            @input="HandleSettingsChange"
            @change="HandleSettingsChange"
          /><span class="value-label">{{ base_floor_stop }}</span>
        </div>
      </div>
    </div>

    <!-- 
  Fog Floor Color
-->
    <div class="panel">
      <label>Fog Floor Color</label>
      <div class="flex width-12">
        <v-input-colorpicker
          v-model="gradient_fogFloor_color_1"
          @input="HandleSettingsChange"
          @change="HandleSettingsChange"
        />
        <div class="range-slider flex width-12">
          <input
            min="0"
            max="1"
            step="0.01"
            type="range"
            v-model="gradient_fogFloor_stop_1"
            @input="HandleSettingsChange"
            @change="HandleSettingsChange"
          /><span class="value-label">{{ gradient_fogFloor_stop_1 }}</span>
        </div>
      </div>

      <div class="flex width-12">
        <v-input-colorpicker
          v-model="gradient_fogFloor_color_2"
          @input="HandleSettingsChange"
          @change="HandleSettingsChange"
        />
        <div class="range-slider flex width-12">
          <input
            min="0"
            max="1"
            step="0.01"
            type="range"
            v-model="gradient_fogFloor_stop_2"
            @input="HandleSettingsChange"
            @change="HandleSettingsChange"
          /><span class="value-label">{{ gradient_fogFloor_stop_2 }}</span>
        </div>
      </div>

      <div class="flex width-12">
        <v-input-colorpicker
          v-model="gradient_fogFloor_color_3"
          @input="HandleSettingsChange"
          @change="HandleSettingsChange"
        />
        <div class="range-slider flex width-12">
          <input
            min="0"
            max="1"
            step="0.01"
            type="range"
            v-model="gradient_fogFloor_stop_3"
            @input="HandleSettingsChange"
            @change="HandleSettingsChange"
          /><span class="value-label">{{ gradient_fogFloor_stop_3 }}</span>
        </div>
      </div>
    </div>

    <!-- 
  Fog Floor Color Alpha
-->
    <div class="panel">
      <label>Fog Floor Alpha</label>
      <div class="flex width-12">
        <v-input-colorpicker
          v-model="gradient_fogFloorAlpha_color_1"
          @input="HandleSettingsChange"
          @change="HandleSettingsChange"
        />
        <div class="range-slider flex width-12">
          <input
            min="0"
            max="1"
            step="0.01"
            type="range"
            v-model="gradient_fogFloorAlpha_stop_1"
            @input="HandleSettingsChange"
            @change="HandleSettingsChange"
          /><span class="value-label">{{ gradient_fogFloorAlpha_stop_1 }}</span>
        </div>
      </div>

      <div class="flex width-12">
        <v-input-colorpicker
          v-model="gradient_fogFloorAlpha_color_2"
          @input="HandleSettingsChange"
          @change="HandleSettingsChange"
        />
        <div class="range-slider flex width-12">
          <input
            min="0"
            max="1"
            step="0.01"
            type="range"
            v-model="gradient_fogFloorAlpha_stop_2"
            @input="HandleSettingsChange"
            @change="HandleSettingsChange"
          /><span class="value-label">{{ gradient_fogFloorAlpha_stop_2 }}</span>
        </div>
      </div>

      <div class="flex width-12">
        <v-input-colorpicker
          v-model="gradient_fogFloorAlpha_color_3"
          @input="HandleSettingsChange"
          @change="HandleSettingsChange"
        />
        <div class="range-slider flex width-12">
          <input
            min="0"
            max="1"
            step="0.01"
            type="range"
            v-model="gradient_fogFloorAlpha_stop_3"
            @input="HandleSettingsChange"
            @change="HandleSettingsChange"
          /><span class="value-label">{{ gradient_fogFloorAlpha_stop_3 }}</span>
        </div>
      </div>

      <div class="flex width-12">
        <v-input-colorpicker
          v-model="gradient_fogFloorAlpha_color_4"
          @input="HandleSettingsChange"
          @change="HandleSettingsChange"
        />
        <div class="range-slider flex width-12">
          <input
            min="0"
            max="1"
            step="0.01"
            type="range"
            v-model="gradient_fogFloorAlpha_stop_4"
            @input="HandleSettingsChange"
            @change="HandleSettingsChange"
          /><span class="value-label">{{ gradient_fogFloorAlpha_stop_4 }}</span>
        </div>
      </div>
    </div>

    <!-- 
  gradient_bg_front_color_1
-->
    <div class="panel">
      <label>Gradient Background Front</label>
      <div class="flex width-12">
        <v-input-colorpicker
          v-model="gradient_bg_front_color_1"
          @input="HandleSettingsChange"
          @change="HandleSettingsChange"
        />
        <div class="range-slider flex width-12">
          <input
            min="0"
            max="1"
            step="0.01"
            type="range"
            v-model="gradient_bg_front_stop_1"
            @input="HandleSettingsChange"
            @change="HandleSettingsChange"
          /><span class="value-label">{{ gradient_bg_front_stop_1 }}</span>
        </div>
      </div>

      <div class="flex width-12">
        <v-input-colorpicker
          v-model="gradient_bg_front_color_2"
          @input="HandleSettingsChange"
          @change="HandleSettingsChange"
        />
        <div class="range-slider flex width-12">
          <input
            min="0"
            max="1"
            step="0.01"
            type="range"
            v-model="gradient_bg_front_stop_2"
            @input="HandleSettingsChange"
            @change="HandleSettingsChange"
          /><span class="value-label">{{ gradient_bg_front_stop_2 }}</span>
        </div>
      </div>
    </div>

    <!-- 
  gradient_bg_back_color_1
-->
    <div class="panel">
      <label>Gradient Background Back</label>
      <div class="flex width-12">
        <v-input-colorpicker
          v-model="gradient_bg_back_color_1"
          @input="HandleSettingsChange"
          @change="HandleSettingsChange"
        />
        <div class="range-slider flex width-12">
          <input
            min="0"
            max="1"
            step="0.01"
            type="range"
            v-model="gradient_bg_back_stop_1"
            @input="HandleSettingsChange"
            @change="HandleSettingsChange"
          /><span class="value-label">{{ gradient_bg_back_stop_1 }}</span>
        </div>
      </div>

      <div class="flex width-12">
        <v-input-colorpicker
          v-model="gradient_bg_back_color_2"
          @input="HandleSettingsChange"
          @change="HandleSettingsChange"
        />
        <div class="range-slider flex width-12">
          <input
            min="0"
            max="1"
            step="0.01"
            type="range"
            v-model="gradient_bg_back_stop_2"
            @input="HandleSettingsChange"
            @change="HandleSettingsChange"
          /><span class="value-label">{{ gradient_bg_back_stop_2 }}</span>
        </div>
      </div>
    </div>

    <!-- 
  gradient_bg_moving_color
-->
    <div class="panel">
      <label>Gradient Background Moving</label>
      <div class="flex width-12">
        <v-input-colorpicker
          v-model="gradient_bg_moving_color_1"
          @input="HandleSettingsChange"
          @change="HandleSettingsChange"
        />
        <div class="range-slider flex width-12">
          <input
            min="0"
            max="1"
            step="0.01"
            type="range"
            v-model="gradient_bg_moving_stop_1"
            @input="HandleSettingsChange"
            @change="HandleSettingsChange"
          /><span class="value-label">{{ gradient_bg_moving_stop_1 }}</span>
        </div>
      </div>

      <div class="flex width-12">
        <v-input-colorpicker
          v-model="gradient_bg_moving_color_2"
          @input="HandleSettingsChange"
          @change="HandleSettingsChange"
        />
        <div class="range-slider flex width-12">
          <input
            min="0"
            max="1"
            step="0.01"
            type="range"
            v-model="gradient_bg_moving_stop_2"
            @input="HandleSettingsChange"
            @change="HandleSettingsChange"
          /><span class="value-label">{{ gradient_bg_moving_stop_2 }}</span>
        </div>
      </div>
    </div>

    <div class="panel">
      <button class="cta-button" @click="Save">Speichern</button>
    </div>


  </div>
</template>

<script>
import Utils from "../scripts/utils";

import FileUpload from "./FileUpload.vue";
import mainconfig from '../../main.config';

import { Texture,  RepeatWrapping } from "three";

export default {
  components: { FileUpload },
  data() {
    return {
      name : "ThemeName",
      tex_floor: null,
      tex_floor_x: 1,
      tex_floor_y: 1,
      tex_floor_offset_x: 0,
      tex_floor_offset_y: 0,

      tex_skybox: null,
      tex_skybox_x: 1,
      tex_skybox_y: 1,
      tex_skybox_offset_x: 0,
      tex_skybox_offset_y: 0,

      tex_bg_front: null,
      tex_bg_front_x: 1,
      tex_bg_front_y: 1,
      tex_bg_front_offset_x: 0,
      tex_bg_front_offset_y: 0,


      tex_bg_back: null,
      tex_bg_back_x: 1,
      tex_bg_back_y: 1,
      tex_bg_back_offset_x: 0,
      tex_bg_back_offset_y: 0,

      tex_bg_moving: null,
      tex_bg_moving_x: 1,
      tex_bg_moving_y: 1,
      tex_bg_moving_offset_x: 0,
      tex_bg_moving_offset_y: 0,

      tex_guardian: null,
      tex_guardian_x: 1,
      tex_guardian_y: 1,
      tex_guardian_offset_x: 0,
      tex_guardian_offset_y: 0,

      tex_sun: null,
      tex_sun_x: 1,
      tex_sun_y: 1,
      tex_sun_offset_x: 0,
      tex_sun_offset_y: 0,

      fog_color: "#ffffff",
      //triangleColors
      triangle_colors_1: "#06e9ec",
      triangle_colors_2: "#0452fa",
      triangle_colors_3: "#600bfe",

      triangle_colors_4: "#3508fe",
      triangle_colors_5: "#05a0f3",
      triangle_colors_6: "#042afc",

      triangle_colors_7: "#05c5f0",
      triangle_colors_8: "#0a06fd",
      triangle_colors_9: "#047af7",

      triangle_color_bottom: "#ffc000",

      //Gradient Sun
      gradient_sun_color_1: "#d43511",
      gradient_sun_stop_1: 0,

      gradient_sun_color_2: "#d43511",
      gradient_sun_stop_2: 0.7,

      //Base floor
      base_floor_color: "#d43511",
      base_floor_stop: 0.7,

      //Gradient Skybox
      gradient_skybox_color_1: "#0f1336",
      gradient_skybox_stop_1: 0,

      gradient_skybox_color_2: "#0f1336",
      gradient_skybox_stop_2: 0.6,

      gradient_skybox_color_3: "#0f1336",
      gradient_skybox_stop_3: 0.8,

      gradient_skybox_color_4: "#0f1336",
      gradient_skybox_stop_4: 0.9,

      //Gradient Fog Skybox
      gradient_fogFloor_color_1: "#0f1336",
      gradient_fogFloor_stop_1: 0,

      gradient_fogFloor_color_2: "#0f1336",
      gradient_fogFloor_stop_2: 0.6,

      gradient_fogFloor_color_3: "#0f1336",
      gradient_fogFloor_stop_3: 0.8,

      //Gradient Fog Skybox
      gradient_fogFloorAlpha_color_1: "#000000",
      gradient_fogFloorAlpha_stop_1: 0,

      gradient_fogFloorAlpha_color_2: "#ffffff",
      gradient_fogFloorAlpha_stop_2: 0.6,

      gradient_fogFloorAlpha_color_3: "#ffffff",
      gradient_fogFloorAlpha_stop_3: 0.8,

      gradient_fogFloorAlpha_color_4: "#000000",
      gradient_fogFloorAlpha_stop_4: 0.8,

      //gradient_bg_front
      gradient_bg_front_color_1: "#0d041e",
      gradient_bg_front_stop_1: 0,

      gradient_bg_front_color_2: "#4200e9",
      gradient_bg_front_stop_2: 0.6,

      //gradient_bg_back
      gradient_bg_back_color_1: "#0d041e",
      gradient_bg_back_stop_1: 0,

      gradient_bg_back_color_2: "#4200e9",
      gradient_bg_back_stop_2: 0.6,

      //gradient_bg_moving
      gradient_bg_moving_color_1: "#0d041e",
      gradient_bg_moving_stop_1: 0,

      gradient_bg_moving_color_2: "#4200e9",
      gradient_bg_moving_stop_2: 0.6,
    };
  },
  mounted() {
    this.HandleSettingsChange(null);

  },
  sockets: {
    "server-saved-theme" : function(d){
      console.log(d);
      console.log(d.link);

      var element = document.createElement('a');

      var downloadLink = mainconfig.IP +":"+ mainconfig.PORT + "/" + d.link + ".zip";

      console.log(downloadLink)
          element.setAttribute('href', downloadLink);

          element.style.display = 'none';
          document.body.appendChild(element);

          element.click();

          document.body.removeChild(element);

    }
  },
  methods: {
    HandleImageUpload(name, base64) {
      this[name] = base64;

      var image = new Image();
      image.src = base64;
      image.classList.add("test");
      image.onload = () => {
        var texture = new Texture();
        texture.image = image;
        texture.needsUpdate = true;
        texture.wrapS = texture.wrapT = RepeatWrapping;

        document.body.appendChild(image);


        //texture.repeat.set(3, 3);
        this.$store.state.materialController[name].material.material.uniforms.texture_1.value = texture;
        this.$store.state.materialController[name].material.material.uniforms.texture_2.value = texture;
        
        this.$store.state.materialController[name].material.material.uniforms.alpha_texture_1.value = texture;
        this.$store.state.materialController[name].material.material.uniforms.alpha_texture_2.value = texture;
        
        console.log(this.$store.state.materialController[name].material.material.uniforms);
      };
    },

    DeleteImage(name){
      this[name] = null;
      this.$store.state.materialController[name].material.material.uniforms.texture_1.value = null;
      this.$store.state.materialController[name].material.material.uniforms.texture_2.value = null;
      
      this.$store.state.materialController[name].material.material.uniforms.alpha_texture_1.value = null;
      this.$store.state.materialController[name].material.material.uniforms.alpha_texture_2.value = null;
    },

    HandleImageTiling(name, x, y) {

      console.log(this.$store.state.materialController[name].material.material.uniforms);
      this.$store.state.materialController[name].material.material.uniforms.texture_1.value.repeat.set(x, y);
      this.$store.state.materialController[name].material.material.uniforms.texture_1.value.needsUpdate = true;
      this.$store.state.materialController[name].material.material.uniforms.textureRepeat_1.value.set(x,y);
      
      this.$store.state.materialController[name].material.material.uniforms.alpha_texture_1.value.repeat.set(x, y);
      this.$store.state.materialController[name].material.material.uniforms.alpha_texture_1.value.needsUpdate = true;

      this.$store.state.materialController[name].material.material.uniforms.texture_2.value.repeat.set(x, y);
      this.$store.state.materialController[name].material.material.uniforms.texture_2.value.needsUpdate = true;
      this.$store.state.materialController[name].material.material.uniforms.textureRepeat_2.value.set(x,y);

      this.$store.state.materialController[name].material.material.uniforms.alpha_texture_2.value.repeat.set(x, y);
      this.$store.state.materialController[name].material.material.uniforms.alpha_texture_2.value.needsUpdate = true;
      
      this.$store.state.materialController[name].material.material.uniformsNeedUpdate = true;
    },
    HandleImageOffset(name, x, y) {

      this.$store.state.materialController[name].material.material.uniforms.textureOffset_1.value.set(x,y);
      this.$store.state.materialController[name].material.material.uniforms.textureOffset_2.value.set(x,y);      
      this.$store.state.materialController[name].material.material.uniformsNeedUpdate = true;
    },

    HandleSettingsChange(value) {
      console.log(
        "change setting",
        value,
        this.$store.state.xr,
        this.$store.state.materialController
      );

      if (this.$store.state.xr == null) {
        return;
      }

      //FOG Color
      this.$store.state.xr.Scene.fog.color.set(this.fog_color);

      // Gradient SunColor
      this.$store.state.materialController.gradient_sun.SetGradient([
        {
          stop: this.gradient_sun_stop_1,
          value: Utils.hexToHSL(this.gradient_sun_color_1),
        },
        {
          stop: this.gradient_sun_stop_2,
          value: Utils.hexToHSL(this.gradient_sun_color_2),
        },
      ]);

      // Gradient Skybox
      this.$store.state.materialController.gradient_skybox.SetGradient([
        {
          stop: this.gradient_skybox_stop_1,
          value: Utils.hexToHSL(this.gradient_skybox_color_1),
        },
        {
          stop: this.gradient_skybox_stop_2,
          value: Utils.hexToHSL(this.gradient_skybox_color_2),
        },
        {
          stop: this.gradient_skybox_stop_3,
          value: Utils.hexToHSL(this.gradient_skybox_color_3),
        },
        {
          stop: this.gradient_skybox_stop_4,
          value: Utils.hexToHSL(this.gradient_skybox_color_4),
        },
      ]);

      // Gradient Fog Floor
      this.$store.state.materialController.gradient_fogFloor.SetGradient([
        {
          stop: this.gradient_fogFloor_stop_1,
          value: Utils.hexToHSL(this.gradient_fogFloor_color_1),
        },
        {
          stop: this.gradient_fogFloor_stop_2,
          value: Utils.hexToHSL(this.gradient_fogFloor_color_2),
        },
        {
          stop: this.gradient_fogFloor_stop_3,
          value: Utils.hexToHSL(this.gradient_fogFloor_color_3),
        },
      ]);

      // Gradient Fog Floor Alpha
      this.$store.state.materialController.gradient_fogFloorAlpha.SetGradient([
        {
          stop: this.gradient_fogFloorAlpha_stop_1,
          value: Utils.hexToHSL(this.gradient_fogFloorAlpha_color_1),
        },
        {
          stop: this.gradient_fogFloorAlpha_stop_2,
          value: Utils.hexToHSL(this.gradient_fogFloorAlpha_color_2),
        },
        {
          stop: this.gradient_fogFloorAlpha_stop_3,
          value: Utils.hexToHSL(this.gradient_fogFloorAlpha_color_3),
        },
        {
          stop: this.gradient_fogFloorAlpha_stop_4,
          value: Utils.hexToHSL(this.gradient_fogFloorAlpha_color_4),
        },
      ]);

      // gradient_bg_front
      this.$store.state.materialController.gradient_bg_front.SetGradient([
        {
          stop: this.gradient_bg_front_stop_1,
          value: Utils.hexToHSL(this.gradient_bg_front_color_1),
        },
        {
          stop: this.gradient_bg_front_stop_2,
          value: Utils.hexToHSL(this.gradient_bg_front_color_2),
        },
      ]);

      // gradient_bg_back
      this.$store.state.materialController.gradient_bg_back.SetGradient([
        {
          stop: this.gradient_bg_back_stop_1,
          value: Utils.hexToHSL(this.gradient_bg_back_color_1),
        },
        {
          stop: this.gradient_bg_back_stop_2,
          value: Utils.hexToHSL(this.gradient_bg_back_color_2),
        },
      ]);

      // gradient_bg_moving
      this.$store.state.materialController.gradient_bg_moving.SetGradient([
        {
          stop: this.gradient_bg_moving_stop_1,
          value: Utils.hexToHSL(this.gradient_bg_moving_color_1),
        },
        {
          stop: this.gradient_bg_moving_stop_2,
          value: Utils.hexToHSL(this.gradient_bg_moving_color_2),
        },
      ]);

      //Base Floor
      this.$store.state.materialController.materials.base_floor.color.set(
        Utils.hexToHSL(this.base_floor_color)
      );
    },

    Save(){
      console.log(this.$data)

      this.$socket.emit("client-save-theme", this.$data);
    }
  },
};
</script>
<style>
input.icp__input {
  box-shadow: 0 0 0 1px;
  margin: 5px;
}

.value-label {
  min-width: 40px;
  text-align: center;
  line-height: 30px;
  font-weight: bold;
}

.width-12 {
  width: 100%;
}

.panel {
  margin-bottom: 2rem;
}

.image img {
  width: 50px;
  height: auto;
}
.image button {
  width: 20px;
  height: 20px;
  border-radius: 30px;
  background: #f44336;
  
}

.image button:before{
    content:"x";
    color:#fff;
  }
</style>
