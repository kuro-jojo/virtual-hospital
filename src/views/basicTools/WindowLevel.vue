<template>
  <div>
    <h3>Window Level Basic Usage</h3>
    <el-alert
      title="Loading data source from the cornerstone server, it may take a while"
      type="warning"
    ></el-alert>
    <el-alert
      title="If your computer freezes, press ESC to end the adjustment, then adjust the second one"
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
import {
  cache,
  Enums as csEnums,
  getRenderingEngine,
  RenderingEngine,
  setVolumesForViewports,
  volumeLoader,
} from "@cornerstonejs/core";
import { getTestImageId, initCornerstone } from "@/cornerstone";
import {
  addTool,
  Enums as cstEnums,
  destroy as cstDestroy,
  ToolGroupManager,
  WindowLevelTool,
} from "@cornerstonejs/tools";

export default {
  name: "WindowLevel",
  data() {
    return {
      volumeId: "my_volume_id",
      renderingEngineId: "my_renderingEngine",
      viewportId1: "CT_AXIAL",
      viewportId2: "CT_SAGITTAL",
      viewportId3: "CT_CORONAL",
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

      this.addTools();

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

      renderingEngine.renderViewports([
        this.viewportId1,
        this.viewportId2,
        this.viewportId3,
      ]);
    },

    addTools() {
      addTool(WindowLevelTool);

      const toolGroup = ToolGroupManager.createToolGroup(this.toolGroupId);
      toolGroup.addTool(WindowLevelTool.toolName);

      toolGroup.addViewport(this.viewportId1, this.renderingEngineId);
      toolGroup.addViewport(this.viewportId2, this.renderingEngineId);
      toolGroup.addViewport(this.viewportId3, this.renderingEngineId);

      toolGroup.setToolActive(WindowLevelTool.toolName, {
        bindings: [
          {
            mouseButton: cstEnums.MouseBindings.Primary,
          },
        ],
      });
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
