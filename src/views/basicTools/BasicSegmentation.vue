<template>
  <div>
    <h3>Basic Segmentation</h3>
    <el-alert
      title="Loading data from the cornerstone server, it may take a while"
      type="warning"
    ></el-alert>
    <el-alert
      title="Press ESC key to finish drawing one SEG, then start drawing the second one"
      type="info"
      style="margin-top: 20px"
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
  cache,
  Enums as csEnums,
  getRenderingEngine,
  RenderingEngine,
  setVolumesForViewports,
  volumeLoader,
} from "@cornerstonejs/core";

import {
  Enums as cstEnums,
  addTool,
  destroy as cstDestroy,
  segmentation,
  SegmentationDisplayTool,
  ToolGroupManager,
  BrushTool,
} from "@cornerstonejs/tools";

export default {
  name: "BasicSegmentation",
  data() {
    return {
      volumeId: "my_volume_id",
      derivedVolumeId: "derived_volume_id",
      renderingEngineId: "my_renderingEngine",
      viewportId1: "CT_AXIAL",
      viewportId2: "CT_SAGITTAL",
      viewportId3: "CT_CORONAL",
      segmentationId: "my_segmentation",
      toolGroupId: "my_tool_group",
    };
  },
  mounted() {
    this.init();
  },

  beforeDestroy() {
    getRenderingEngine(this.renderingEngineId).destroy();
    cache.removeVolumeLoadObject(this.volumeId);
    cache.removeVolumeLoadObject(this.derivedVolumeId);
    cstDestroy();
  },
  methods: {
    async init() {
      await initCornerstone();
      const imageIds = await getTestImageId();

      const renderingEngine = new RenderingEngine(this.renderingEngineId);

      const viewportInputArray = [
        {
          viewportId: this.viewportId1,
          type: csEnums.ViewportType.ORTHOGRAPHIC,
          element: document.querySelector("#element1"),
          defaultOptions: {
            orientation: csEnums.OrientationAxis.AXIAL,
          },
        },
        {
          viewportId: this.viewportId2,
          type: csEnums.ViewportType.ORTHOGRAPHIC,
          element: document.querySelector("#element2"),
          defaultOptions: {
            orientation: csEnums.OrientationAxis.SAGITTAL,
          },
        },
        {
          viewportId: this.viewportId3,
          type: csEnums.ViewportType.ORTHOGRAPHIC,
          element: document.querySelector("#element3"),
          defaultOptions: {
            orientation: csEnums.OrientationAxis.CORONAL,
          },
        },
      ];
      renderingEngine.setViewports(viewportInputArray);

      this.addSegmentTools();

      const volume = await volumeLoader.createAndCacheVolume(this.volumeId, {
        imageIds,
      });

      volume.load();

      await setVolumesForViewports(
        renderingEngine,
        [
          {
            volumeId: this.volumeId,
          },
        ],
        [this.viewportId1, this.viewportId2, this.viewportId3]
      );

      await this.addSegmentationsToState();

      renderingEngine.renderViewports([
        this.viewportId1,
        this.viewportId2,
        this.viewportId3,
      ]);
    },

    addSegmentTools() {
      addTool(SegmentationDisplayTool);
      addTool(BrushTool);

      const toolGroup = ToolGroupManager.createToolGroup(this.toolGroupId);
      toolGroup.addTool(SegmentationDisplayTool.toolName);
      toolGroup.addTool(BrushTool.toolName);
      toolGroup.addToolInstance("CircularBrush", BrushTool.toolName, {
        activeStrategy: "FILL_INSIDE_CIRCLE",
      });

      toolGroup.addViewport(this.viewportId1, this.renderingEngineId);
      toolGroup.addViewport(this.viewportId2, this.renderingEngineId);
      toolGroup.addViewport(this.viewportId3, this.renderingEngineId);

      toolGroup.setToolEnabled(SegmentationDisplayTool.toolName);
      toolGroup.setToolActive("CircularBrush", {
        bindings: [
          {
            mouseButton: cstEnums.MouseBindings.Primary,
          },
        ],
      });
    },

    async addSegmentationsToState() {
      await volumeLoader.createAndCacheDerivedVolume(this.volumeId, {
        volumeId: this.derivedVolumeId,
      });

      segmentation.addSegmentations([
        {
          segmentationId: this.segmentationId,
          representation: {
            type: cstEnums.SegmentationRepresentations.Labelmap,
            data: {
              volumeId: this.derivedVolumeId,
            },
          },
        },
      ]);

      await segmentation.addSegmentationRepresentations(this.toolGroupId, [
        {
          segmentationId: this.segmentationId,
          type: cstEnums.SegmentationRepresentations.Labelmap,
        },
      ]);
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
