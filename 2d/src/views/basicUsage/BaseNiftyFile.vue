<template>
  <div>
    <h3>Loading and Rendering NifTi File</h3>
    <div id="demo-wrap">
      <div id="element1" class="cornerstone-item"></div>
      <div id="element2" class="cornerstone-item"></div>
      <div id="element3" class="cornerstone-item"></div>
    </div>
    <el-alert title="Loading data source from cornerstone server, please wait as it may take some time"
      type="warning"></el-alert>
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
import { cornerstoneNiftiImageVolumeLoader } from "@cornerstonejs/nifti-volume-loader";
import { initCornerstone } from "../../cornerstone";

export default {
  name: "VueCornerstoneDemoNiftyFile",

  data() {
    return {
      volumeId: "",
      renderingEngineId: "my_renderingEngine_3",
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

      volumeLoader.registerVolumeLoader(
        "nifti",
        cornerstoneNiftiImageVolumeLoader
      );

      const niftiURL =
        "https://ohif-assets.s3.us-east-2.amazonaws.com/nifti/MRHead.nii.gz";

      const volumeId = "nifti:" + niftiURL;
      this.volumeId = volumeId;
      await volumeLoader.createAndCacheVolume(volumeId);

      const renderingEngine = new RenderingEngine(this.renderingEngineId);

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

      await setVolumesForViewports(
        renderingEngine,
        [
          {
            volumeId: volumeId,
          },
        ],
        [viewportId1, viewportId2, viewportId3]
      );

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
