<template>
  <div>
    <h3>Render Volume</h3>
    <el-alert
      title="Loading demo data source from cornerstone server, please wait as it may take some time"
      type="warning"
    ></el-alert>
    <div id="demo-wrap">
      <div id="element1" class="cornerstone-item"></div>
      <div id="element2" class="cornerstone-item"></div>
      <div id="element3" class="cornerstone-item"></div>
    </div>
  </div>
</template>

<script>
import {
  cache,
  volumeLoader,
  RenderingEngine,
  Enums as csEnums,
  setVolumesForViewports,
  getRenderingEngine,
} from "@cornerstonejs/core";

import { initCornerstone, getTestImageId } from "../../cornerstone";

export default {
  name: "BaseVolume",

  data() {
    return {
      volumeId: "my_volume_id_2",
      renderingEngineId: "my_renderingEngine_2",
      volume: null,
    };
  },

  mounted() {
    this.init();
  },

  beforeDestroy() {
    getRenderingEngine(this.renderingEngineId).destroy();
    cache.removeVolumeLoadObject(this.volumeId);
  },

  methods: {
    async init() {
      await initCornerstone();
      const imageIds = await getTestImageId();

      // Prepare a rendering engine => renderingEngine
      const renderingEngine = new RenderingEngine(this.renderingEngineId);
      // Create and cache a Volume
      const volume = await volumeLoader.createAndCacheVolume(this.volumeId, {
        imageIds,
      });
      this.volume = volume;

      console.log(volume);
      // Create and load views in the rendering engine, binding the views to HTML elements
      const viewportId1 = "CT_AXIAL";
      const viewportId2 = "CT_SAGITTAL";
      const viewportId3 = "CT_CORONAL";
      const viewportInputArray = [
        {
          viewportId: viewportId1,
          type: csEnums.ViewportType.ORTHOGRAPHIC,
          element: document.querySelector("#element1"),
          defaultOptions: {
            orientation: csEnums.OrientationAxis.AXIAL,
          },
        },
        {
          viewportId: viewportId2,
          type: csEnums.ViewportType.ORTHOGRAPHIC,
          element: document.querySelector("#element2"),
          defaultOptions: {
            orientation: csEnums.OrientationAxis.SAGITTAL,
          },
        },
        {
          viewportId: viewportId3,
          type: csEnums.ViewportType.ORTHOGRAPHIC,
          element: document.querySelector("#element3"),
          defaultOptions: {
            orientation: csEnums.OrientationAxis.CORONAL,
          },
        },
      ];
      renderingEngine.setViewports(viewportInputArray);

      // Load the Volume => Note: creating is creating, loading is loading, loading will request the Dicom file
      await volume.load();

      // Set the Volume on the views
      await setVolumesForViewports(
        renderingEngine,
        [
          {
            volumeId: this.volumeId,
          },
        ],
        [viewportId1, viewportId2, viewportId3]
      );

      console.log(renderingEngine);
      // Render the images
      renderingEngine.renderViewports([viewportId1, viewportId2, viewportId3]);
    },
  },
};
</script>

<style lang="scss" scoped>
.cornerstone-item {
  display: inline-block;
  width: 300px;
  height: 300px;
  margin-top: 20px;
}
</style>
