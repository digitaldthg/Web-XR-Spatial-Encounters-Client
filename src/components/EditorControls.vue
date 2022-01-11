<template>
  <div class="grid-1 info-panel">
    <div class="panel">
      <label>Theme Name</label>
      <input class="text-input" v-model="name" />
    </div>

    <div class="container">
      <div class="container-header" :class="{open : panel_allgemein}" @click="TogglePanel('panel_allgemein', !panel_allgemein)">
        <h3>Allgemein</h3>
      </div>
      <div class="container-container" v-if="panel_allgemein">
        <!--
        Nebel Farbe
      -->
        <div class="panel">
          <label>Nebelfarbe</label>
          <v-input-colorpicker
            v-model="fog_color"
            @input="HandleSettingsChange"
            @change="HandleSettingsChange"
          />
        </div>
        <!--
  Spielerfarben
-->
        <div class="panel">
          <label>Spielerfarben (Triangles)</label>
          <v-input-colorpicker
            @input="HandleSettingsChange"
            @change="HandleSettingsChange"
            v-model="triangle_colors_1"
          />
          <v-input-colorpicker
            @input="HandleSettingsChange"
            @change="HandleSettingsChange"
            v-model="triangle_colors_2"
          />
          <v-input-colorpicker
            @input="HandleSettingsChange"
            @change="HandleSettingsChange"
            v-model="triangle_colors_3"
          /><br />

          <v-input-colorpicker
            @input="HandleSettingsChange"
            @change="HandleSettingsChange"
            v-model="triangle_colors_4"
          />
          <v-input-colorpicker
            @input="HandleSettingsChange"
            @change="HandleSettingsChange"
            v-model="triangle_colors_5"
          />
          <v-input-colorpicker
            @input="HandleSettingsChange"
            @change="HandleSettingsChange"
            v-model="triangle_colors_6"
          /><br />

          <v-input-colorpicker
            @input="HandleSettingsChange"
            @change="HandleSettingsChange"
            v-model="triangle_colors_7"
          />
          <v-input-colorpicker
            @input="HandleSettingsChange"
            @change="HandleSettingsChange"
            v-model="triangle_colors_8"
          />
          <v-input-colorpicker
            @input="HandleSettingsChange"
            @change="HandleSettingsChange"
            v-model="triangle_colors_9"
          />
        </div>
      </div>
    </div>

    <div class="container">
      <div class="container-header" :class="{open : panel_guardian}"  @click="TogglePanel('panel_guardian', !panel_guardian)">
        <h3>Guardian</h3>
      </div>

      <div class="container-content" v-if="panel_guardian">
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
                    HandleImageTiling(
                      'tex_guardian',
                      tex_guardian_x,
                      tex_guardian_y
                    )
                "
              />
              <input
                type="number"
                v-model.number="tex_guardian_y"
                @input="
                  (value) =>
                    HandleImageTiling(
                      'tex_guardian',
                      tex_guardian_x,
                      tex_guardian_y
                    )
                "
              />
            </div>
            <label>Offset (0-1)</label>
            <div class="flex">
              <input
                type="number"
                min="0"
                max="1"
                step=".01"
                v-model.number="tex_guardian_offset_x"
                @input="
                  (value) =>
                    HandleImageOffset(
                      'tex_guardian',
                      tex_guardian_offset_x,
                      tex_guardian_offset_y
                    )
                "
              />
              <input
                type="number"
                min="0"
                max="1"
                step=".01"
                v-model.number="tex_guardian_offset_y"
                @input="
                  (value) =>
                    HandleImageOffset(
                      'tex_guardian',
                      tex_guardian_offset_x,
                      tex_guardian_offset_y
                    )
                "
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="container-header"  :class="{open : panel_sky}"   @click="TogglePanel('panel_sky', !panel_sky)">
        <h3>Skybox</h3>
      </div>

      <div class="container-content" v-if="panel_sky">
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
                  (value) =>
                    HandleImageTiling('tex_skybox', tex_skybox_x, tex_skybox_y)
                "
              />
              <input
                type="number"
                v-model.number="tex_skybox_y"
                @input="
                  (value) =>
                    HandleImageTiling('tex_skybox', tex_skybox_x, tex_skybox_y)
                "
              />
            </div>
            <label>Offset (0-1)</label>
            <div class="flex">
              <input
                type="number"
                min="0"
                max="1"
                step=".01"
                v-model.number="tex_skybox_offset_x"
                @input="
                  (value) =>
                    HandleImageOffset(
                      'tex_skybox',
                      tex_skybox_offset_x,
                      tex_skybox_offset_y
                    )
                "
              />
              <input
                type="number"
                min="0"
                max="1"
                step=".01"
                v-model.number="tex_skybox_offset_y"
                @input="
                  (value) =>
                    HandleImageOffset(
                      'tex_skybox',
                      tex_skybox_offset_x,
                      tex_skybox_offset_y
                    )
                "
              />
            </div>
          </div>
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
      </div>
    </div>

    <div class="container">
      <div class="container-header"  :class="{open : panel_floor}" @click="TogglePanel('panel_floor', !panel_floor)">
        <h3>Floor</h3>
      </div>
      <div class="container-content" v-if="panel_floor">
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
            <label>Offset (0-1)</label>
            <div class="flex">
              <input
                type="number"
                min="0"
                max="1"
                step=".01"
                v-model.number="tex_floor_offset_x"
                @input="
                  (value) =>
                    HandleImageOffset(
                      'tex_floor',
                      tex_floor_offset_x,
                      tex_floor_offset_y
                    )
                "
              />
              <input
                type="number"
                min="0"
                max="1"
                step=".01"
                v-model.number="tex_floor_offset_y"
                @input="
                  (value) =>
                    HandleImageOffset(
                      'tex_floor',
                      tex_floor_offset_x,
                      tex_floor_offset_y
                    )
                "
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="container-header" :class="{open : panel_fog_floor}"  @click="TogglePanel('panel_fog_floor', !panel_fog_floor)">
        <h3>Fog Floor</h3>
      </div>
      <div class="container-content" v-if="panel_fog_floor">
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
              /><span class="value-label">{{
                gradient_fogFloorAlpha_stop_1
              }}</span>
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
              /><span class="value-label">{{
                gradient_fogFloorAlpha_stop_2
              }}</span>
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
              /><span class="value-label">{{
                gradient_fogFloorAlpha_stop_3
              }}</span>
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
              /><span class="value-label">{{
                gradient_fogFloorAlpha_stop_4
              }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="container-header" :class="{open : panel_bg_front}" @click="TogglePanel('panel_bg_front', !panel_bg_front)">
        <h3>Background Front</h3>
      </div>
      <div class="container-content" v-if="panel_bg_front">
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
              <img :src="tex_bg_front" />
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
                    HandleImageTiling(
                      'tex_bg_front',
                      tex_bg_front_x,
                      tex_bg_front_y
                    )
                "
              />
              <input
                type="number"
                v-model.number="tex_bg_front_y"
                @input="
                  (value) =>
                    HandleImageTiling(
                      'tex_bg_front',
                      tex_bg_front_x,
                      tex_bg_front_y
                    )
                "
              />
            </div>
            <label>Offset (0-1)</label>
            <div class="flex">
              <input
                type="number"
                min="0"
                max="1"
                step=".01"
                v-model.number="tex_bg_front_offset_x"
                @input="
                  (value) =>
                    HandleImageOffset(
                      'tex_bg_front',
                      tex_bg_front_offset_x,
                      tex_bg_front_offset_y
                    )
                "
              />
              <input
                type="number"
                min="0"
                max="1"
                step=".01"
                v-model.number="tex_bg_front_offset_y"
                @input="
                  (value) =>
                    HandleImageOffset(
                      'tex_bg_front',
                      tex_bg_front_offset_x,
                      tex_bg_front_offset_y
                    )
                "
              />
            </div>
          </div>
        </div>

        <!-- 
  gradient_bg_front_color_1
-->
        <div class="panel">
          <label>Gradient Background Front Color</label>
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
      </div>
    </div>

    <div class="container">
      <div class="container-header" :class="{open : panel_bg_back}" @click="TogglePanel('panel_bg_back', !panel_bg_back)">
        <h3>Background Back</h3>
      </div>
      <div class="container-content" v-if="panel_bg_back">
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
                    HandleImageTiling(
                      'tex_bg_back',
                      tex_bg_back_x,
                      tex_bg_back_y
                    )
                "
              />
              <input
                type="number"
                v-model.number="tex_bg_back_y"
                @input="
                  (value) =>
                    HandleImageTiling(
                      'tex_bg_back',
                      tex_bg_back_x,
                      tex_bg_back_y
                    )
                "
              />
            </div>
            <label>Offset (0-1)</label>
            <div class="flex">
              <input
                type="number"
                min="0"
                max="1"
                step=".01"
                v-model.number="tex_bg_back_offset_x"
                @input="
                  (value) =>
                    HandleImageOffset(
                      'tex_bg_back',
                      tex_bg_back_offset_x,
                      tex_bg_back_offset_y
                    )
                "
              />
              <input
                type="number"
                min="0"
                max="1"
                step=".01"
                v-model.number="tex_bg_back_offset_y"
                @input="
                  (value) =>
                    HandleImageOffset(
                      'tex_bg_back',
                      tex_bg_back_offset_x,
                      tex_bg_back_offset_y
                    )
                "
              />
            </div>
          </div>
        </div>

        <!-- 
  gradient_bg_back_color_1
-->
        <div class="panel">
          <label>Gradient Background Back Color</label>
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
      </div>
    </div>

    <div class="container">
      <div class="container-header"  :class="{open : panel_bg_moving}" @click="TogglePanel('panel_bg_moving', !panel_bg_moving)">
        <h3>Background Moving</h3>
      </div>
      <div class="container-content" v-if="panel_bg_moving">
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
                @input="
                  (value) =>
                    HandleImageTiling(
                      'tex_bg_moving',
                      tex_bg_moving_x,
                      tex_bg_moving_y
                    )
                "
              />
              <input
                type="number"
                v-model.number="tex_bg_moving_y"
                @input="
                  (value) =>
                    HandleImageTiling(
                      'tex_bg_moving',
                      tex_bg_moving_x,
                      tex_bg_moving_y
                    )
                "
              />
            </div>
            <label>Offset (0-1)</label>
            <div class="flex">
              <input
                type="number"
                min="0"
                max="1"
                step=".01"
                v-model.number="tex_bg_moving_offset_x"
                @input="
                  (value) =>
                    HandleImageOffset(
                      'tex_bg_moving',
                      tex_bg_moving_offset_x,
                      tex_bg_moving_offset_y
                    )
                "
              />
              <input
                type="number"
                min="0"
                max="1"
                step=".01"
                v-model.number="tex_bg_moving_offset_y"
                @input="
                  (value) =>
                    HandleImageOffset(
                      'tex_bg_moving',
                      tex_bg_moving_offset_x,
                      tex_bg_moving_offset_y
                    )
                "
              />
            </div>
          </div>
        </div>

        <!-- <div class="panel">
          <label>Gradient Background Moving Alpha</label>
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
        </div> -->
      </div>
    </div>

    <div class="container">
      <div class="container-header"  :class="{open : panel_sun}"  @click="TogglePanel('panel_sun', !panel_sun)">
        <h3>Sun</h3>
      </div>
      <div class="container-content" v-if="panel_sun">
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
              <img :src="tex_sun" />
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
                  (value) => HandleImageTiling('tex_sun', tex_sun_x, tex_sun_y)
                "
              />
              <input
                type="number"
                v-model.number="tex_sun_y"
                @input="
                  (value) => HandleImageTiling('tex_sun', tex_sun_x, tex_sun_y)
                "
              />
            </div>
            <label>Offset (0-1)</label>
            <div class="flex">
              <input
                type="number"
                min="0"
                max="1"
                step=".01"
                v-model.number="tex_sun_offset_x"
                @input="
                  (value) =>
                    HandleImageOffset(
                      'tex_sun',
                      tex_sun_offset_x,
                      tex_sun_offset_y
                    )
                "
              />
              <input
                type="number"
                min="0"
                max="1"
                step=".01"
                v-model.number="tex_sun_offset_y"
                @input="
                  (value) =>
                    HandleImageOffset(
                      'tex_sun',
                      tex_sun_offset_x,
                      tex_sun_offset_y
                    )
                "
              />
            </div>
          </div>
        </div>

        <!-- <div class="panel">
      <label>Triangle Color Bottom</label>
      <v-input-colorpicker
        @input="HandleSettingsChange"
        @change="HandleSettingsChange"
        v-model="triangle_color_bottom"
      />
    </div> -->

        <!-- 
  Gradient Sun Color
-->
        <div class="panel">
          <label>Gradient Sun</label>
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
      </div>
    </div>
    <!-- <div class="panel">
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
    </div> -->

    <!-- 
  gradient_bg_moving_color
-->

    <div class="panel">
      <button class="cta-button" @click="Save">Speichern</button>
    </div>
  </div>
</template>

<script>
import Utils from "../scripts/utils";

import FileUpload from "./FileUpload.vue";
import mainconfig from "../../main.config";

import { Texture, RepeatWrapping } from "three";

export default {
  components: { FileUpload },
  data() {
    return {
      name: "ThemeName",
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
      gradient_sun_color_1: "#000000",
      gradient_sun_stop_1: 0,

      gradient_sun_color_2: "#000000",
      gradient_sun_stop_2: 0.7,

      //Base floor
      base_floor_color: "#000000",
      base_floor_stop: 0.7,

      //Gradient Skybox
      gradient_skybox_color_1: "#000000",
      gradient_skybox_stop_1: 0,

      gradient_skybox_color_2: "#000000",
      gradient_skybox_stop_2: 0.6,

      gradient_skybox_color_3: "#000000",
      gradient_skybox_stop_3: 0.8,

      gradient_skybox_color_4: "#000000",
      gradient_skybox_stop_4: 0.9,

      //Gradient Fog Skybox
      gradient_fogFloor_color_1: "#000000",
      gradient_fogFloor_stop_1: 0,

      gradient_fogFloor_color_2: "#000000",
      gradient_fogFloor_stop_2: 0.5,

      gradient_fogFloor_color_3: "#000000",
      gradient_fogFloor_stop_3: 1,

      //Gradient Fog Skybox
      gradient_fogFloorAlpha_color_1: "#000000",
      gradient_fogFloorAlpha_stop_1: 0,

      gradient_fogFloorAlpha_color_2: "#000000",
      gradient_fogFloorAlpha_stop_2: 0.5,

      gradient_fogFloorAlpha_color_3: "#000000",
      gradient_fogFloorAlpha_stop_3: 1,

      gradient_fogFloorAlpha_color_4: "#000000",
      gradient_fogFloorAlpha_stop_4: 1,

      //gradient_bg_front
      gradient_bg_front_color_1: "#ffffff",
      gradient_bg_front_stop_1: 0,

      gradient_bg_front_color_2: "#ffffff",
      gradient_bg_front_stop_2: 1,

      //gradient_bg_back
      gradient_bg_back_color_1: "#ffffff",
      gradient_bg_back_stop_1: 0,

      gradient_bg_back_color_2: "#ffffff",
      gradient_bg_back_stop_2: 1,

      //gradient_bg_moving
      gradient_bg_moving_color_1: "#ffffff",
      gradient_bg_moving_stop_1: 0,

      gradient_bg_moving_color_2: "#ffffff",
      gradient_bg_moving_stop_2: 1,

      panel_allgemein : false,
      panel_guardian : false,
      panel_sky : false,
      panel_floor : false,
      panel_fog_floor : false,
      panel_bg_front : false,
      panel_bg_back : false,
      panel_bg_moving : false,
      panel_sun : false,
    };
  },
  watch: {
    "$store.state.xr": function() {
      this.ClearEverything();
    },
  },
  mounted() {
    this.ClearEverything();
  },
  sockets: {
    "server-saved-theme": function(d) {
      
      var element = document.createElement("a");

      var downloadLink =
        mainconfig.IP + ":" + mainconfig.PORT + "/" + d.link + ".zip";

      element.setAttribute("href", downloadLink);

      element.style.display = "none";
      document.body.appendChild(element);

      element.click();

      document.body.removeChild(element);


      


    },
  },
  methods: {
    TogglePanel(name , boolean){
      this[name] = boolean;
    },
    ClearEverything() {
      this.HandleSettingsChange(null);

      this.DeleteImage("tex_floor");
      this.DeleteImage("tex_skybox");
      this.DeleteImage("tex_bg_front");
      this.DeleteImage("tex_bg_back");
      this.DeleteImage("tex_bg_moving");
      this.DeleteImage("tex_guardian");
      this.DeleteImage("tex_sun");
    },
    HandleImageUpload(name, base64) {
      this[name] = base64;

      var image = new Image();
      image.src = base64;
      image.classList.add("hidden");
      image.onload = () => {
        var texture = new Texture();
        texture.image = image;
        texture.wrapS = texture.wrapT = RepeatWrapping;

        document.body.appendChild(image);

        texture.repeat.set(this[name + "_x"].x, this[name + "_x"].y);
        texture.needsUpdate = true;
        this.$store.state.materialController[name].material.material.uniforms.texture_1.value = texture;

        if(["tex_sun", "tex_bg_front", "tex_bg_back", "tex_bg_moving"].includes(name)){
          this.$store.state.materialController[name].material.material.uniforms.texture_2.value = this.$store.state.materialController[name.replace("tex_", "gradient_")].texture;
          this.$store.state.materialController[name].material.material.uniforms.alpha.value = 0.5;
          
          this.$store.state.materialController[name].material.material.uniforms.hasAlphaMap_1.value = false;
          this.$store.state.materialController[name].material.material.uniforms.hasAlphaMap_2.value = true;
        }else if(["tex_skybox","tex_floor", "tex_guardian",  ].includes(name)){
          this.$store.state.materialController[name].material.material.uniforms.alpha.value = 1;
          this.$store.state.materialController[name].material.material.uniforms.texture_2.value = texture;
          this.$store.state.materialController[name].material.material.uniforms.hasAlphaMap_1.value = false;
          this.$store.state.materialController[name].material.material.uniforms.hasAlphaMap_2.value = false;
          //
        }
      };
    },

    DeleteImage(name) {
      this[name] = null;

      if (this.$store.state.xr == null) {
        return;
      }
      this.$store.state.materialController[
        name
      ].material.material.uniforms.texture_1.value = null;
      this.$store.state.materialController[
        name
      ].material.material.uniforms.texture_2.value = null;

      this.$store.state.materialController[
        name
      ].material.material.uniforms.alpha_texture_1.value = null;
      this.$store.state.materialController[
        name
      ].material.material.uniforms.alpha_texture_2.value = null;
    },

    HandleImageTiling(name, x, y) {
      
      this.$store.state.materialController[
        name
      ].material.material.uniforms.texture_1.value.repeat.set(x, y);
      this.$store.state.materialController[
        name
      ].material.material.uniforms.texture_1.value.needsUpdate = true;
      this.$store.state.materialController[
        name
      ].material.material.uniforms.textureRepeat_1.value.set(x, y);

      // this.$store.state.materialController[
      //   name
      // ].material.material.uniforms.alpha_texture_1.value.repeat.set(x, y);
      // this.$store.state.materialController[
      //   name
      // ].material.material.uniforms.alpha_texture_1.value.needsUpdate = true;

      this.$store.state.materialController[
        name
      ].material.material.uniforms.texture_2.value.repeat.set(x, y);
      this.$store.state.materialController[
        name
      ].material.material.uniforms.texture_2.value.needsUpdate = true;
      this.$store.state.materialController[
        name
      ].material.material.uniforms.textureRepeat_2.value.set(x, y);
      // }

      // if(this.$store.state.materialController[name].material.material.uniforms.alpha_texture_2.value != null){
      //   this.$store.state.materialController[
      //     name
      //   ].material.material.uniforms.alpha_texture_2.value.repeat.set(x, y);
      //   this.$store.state.materialController[
      //     name
      //   ].material.material.uniforms.alpha_texture_2.value.needsUpdate = true;
      // }
      


      this.$store.state.materialController[
        name
      ].material.material.uniformsNeedUpdate = true;
    },
    HandleImageOffset(name, x, y) {
      this.$store.state.materialController[
        name
      ].material.material.uniforms.textureOffset_1.value.set(x, y);
      this.$store.state.materialController[
        name
      ].material.material.uniforms.textureOffset_2.value.set(x, y);
      this.$store.state.materialController[
        name
      ].material.material.uniformsNeedUpdate = true;
    },

    HandleSettingsChange(value) {
      
      if (this.$store.state.xr == null) {
        return;
      }

      const triangle_colors = [
        this.triangle_colors_1,
        this.triangle_colors_2,
        this.triangle_colors_3,
        this.triangle_colors_4,
        this.triangle_colors_5,
        this.triangle_colors_6,
        this.triangle_colors_7,
        this.triangle_colors_8,
        this.triangle_colors_9,
      ];
      // this.$store.commit("SetTriangleColorsForEditor", triangle_colors);
      // this.$store.commit(
      //   "SetTriangleFloorColorForEditor",
      //   this.triangle_color_bottom
      // );
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

      this.$store.state.materialController.tex_bg_front.material.material.uniformsNeedUpdate = true;
    },

    Save() {
      this.$socket.emit("client-save-theme", this.$data);
    },
  },
};
</script>
<style>
.text-input {
  width: 100%;
  line-height: 1rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  padding: 0.25rem;
  border-radius: 0.4rem;
}
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
  margin-bottom: 1rem;
}

.panel-inner:first-child {
  margin-right: 1rem;
}

.image img {
  width: 50px;
  max-height: 50px;
  height: auto;
}
.image button {
  width: 20px;
  height: 20px;
  border-radius: 30px;
  background: #f44336;
}

.image button:before {
  content: "x";
  color: #fff;
}

.hidden {
  position: absolute;
  opacity: 0;
  display: none;
}

.container {
  margin-bottom: 1rem;
  border-bottom: 1px solid #eee;
}
.container-content {
  padding: 1rem;
  background: #eee;
  border-radius: 5px;
  box-shadow: inset 0 0 5px rgb(0 0 0 / 10%);
}
.container-header{
  cursor: pointer;
  margin-bottom: 1rem;
}
.container-header h3 {
  margin-top: 0;
  vertical-align: middle;
  display: inline-block;
  margin-bottom: 0;
}

.container-header:before {
  content: '';
  display: inline-block;
  width: 0;
  height: 0;
  vertical-align: middle;
  border-top: 5px solid #0000;
  border-right: 5px solid #0000;
  border-bottom: 5px solid #0000;
  border-left: 5px solid ;
  margin-right:5px;
  position: relative;
  left:5px;
  
}

.container-header.open:before{
  border-top: 5px solid ;
  border-right: 5px solid #0000;
  border-bottom: 5px solid #0000;
  border-left: 5px solid #0000;
  top: 2px;
  left: 2px;
}

</style>
