<template>
  <div id="demo-wrap">
    <h3>Render Stack Image</h3>
    <el-alert
      title="Loading data source from cornerstone server, please wait"
      type="warning"
    ></el-alert>
    <div id="element1" class="cornerstone-item"></div>
  </div>
</template>

<script>
import { RenderingEngine, Enums as csEnums } from "@cornerstonejs/core";

import { initCornerstone, getTestImageId } from "../../cornerstone";

export default {
  name: "BaseStack",

  data() {
    return {
      volumeId: "my_volume_id_1",
      renderingEngineId: "my_renderingEngine1",
    };
  },

  mounted() {
    this.init();
  },

  methods: {
    async init() {
      await initCornerstone();
      const imageIds = await getTestImageId();

      // Prepare a rendering engine => renderingEngine
      const renderingEngine = new RenderingEngine(this.renderingEngineId);

      // Create and load a view in the rendering engine, binding the view to an HTML element
      const viewportId = "CT_AXIAL_STACK";
      const viewportInput = {
        viewportId: viewportId,
        element: document.querySelector("#element1"),
        type: csEnums.ViewportType.STACK,
      };
      renderingEngine.enableElement(viewportInput);

      const viewport = renderingEngine.getViewport(viewportId);
      viewport.setStack(imageIds, 60);
      viewport.render();
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
