<template>
  <div>
    <h3>Render PET</h3>
    <el-alert
      title="Loading demo data source from the cornerstone server, please wait as it may take some time"
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
import { getTestImageId, initCornerstone } from "@/cornerstone";
import {
  Enums as csEnums,
  RenderingEngine,
  setVolumesForViewports,
  volumeLoader,
  getRenderingEngine,
  cache,
} from "@cornerstonejs/core";
import getTestPTImageId from "@/cornerstone/getTestPTImageId";
import setCtTransferFunctionForVolumeActor from "@/cornerstone/helper/setCtTransferFunctionForVolumeActor";
import setPetColorMapTransferFunctionForVolumeActor from "@/cornerstone/helper/setPetColorMapTransferFunctionForVolumeActor";

const volumeLoaderScheme = "cornerstoneStreamingImageVolume";
const ctVolumeName = "CT_VOLUME_ID";
const ctVolumeId = `${volumeLoaderScheme}:${ctVolumeName}`;

const ptVolumeName = "PT_VOLUME_ID";
const ptVolumeId = `${volumeLoaderScheme}:${ptVolumeName}`;

export default {
  data() {
    return {
      ctVolumeId,
      ptVolumeId,
      renderingEngineId: "my_renderingEngine_2",
      ctVolume: null,
      ptVolume: null,
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
      const CTImageIds = await getTestImageId();
      const PTImageIds = await getTestPTImageId();

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

      const ctVolume = await volumeLoader.createAndCacheVolume(
        this.ctVolumeId,
        {
          imageIds: CTImageIds,
        }
      );
      this.ctVolume = ctVolume;

      ctVolume.load();

      const ptVolume = await volumeLoader.createAndCacheVolume(
        this.ptVolumeId,
        {
          imageIds: PTImageIds,
        }
      );
      ptVolume.load();

      await setVolumesForViewports(
        renderingEngine,
        [
          {
            volumeId: this.ctVolumeId,
            callback: setCtTransferFunctionForVolumeActor,
          },
          {
            volumeId: this.ptVolumeId,
            callback: setPetColorMapTransferFunctionForVolumeActor,
          },
        ],
        [viewportId1, viewportId2, viewportId3]
      );

      renderingEngine.renderViewports([viewportId1, viewportId2, viewportId3]);
    },
  },
};
</script>

<style scoped lang="scss">
.cornerstone-item {
  display: inline-block;
  width: 300px;
  height: 300px;
  margin-top: 20px;
}
</style>
