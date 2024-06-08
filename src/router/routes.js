import BasePage from "@/views/basicUsage/BasePage.vue";
import BaseVolume from "@/views/basicUsage/BaseVolume.vue";
import BaseStack from "@/views/basicUsage/BaseStack.vue";
import BaseTools from "@/views/basicTools/BaseTool.vue";
import BasicSegmentation from "@/views/basicTools/BasicSegmentation.vue";
import WindowLevel from "@/views/basicTools/WindowLevel.vue";
import BasicPET from "@/views/basicUsage/BasicPET.vue";
import BasicPETUseTool from "@/views/basicTools/BasicPETUseTool.vue";

const basicUsage = {
  name: "Basic Usage",
  path: "/base",
  component: BasePage,
  icon: "el-icon-location",
  children: [
    {
      path: "stack",
      name: "Render Stack Image",
      component: BaseStack,
    },
    {
      path: "baseVolume",
      name: "Render Volume",
      component: BaseVolume,
    },
    // {
    //   path: "niftiFile",
    //   name: "Load Nifti File",
    //   component: BaseNiftyFile,
    // },
    {
      path: "basicPET",
      name: "Render PET Mode",
      component: BasicPET,
    },
  ],
};

const basicToolsUsage = {
  name: "Basic Tools Usage",
  path: "/tools",
  component: BaseTools,
  icon: "el-icon-set-up",
  children: [
    {
      path: "segmentation",
      name: "Basic Segmentation Tool Usage",
      component: BasicSegmentation,
    },
    {
      path: "windowLevelTool",
      name: "Basic Window Level Tool Usage",
      component: WindowLevel,
    },
    {
      path: "basicPETTools",
      name: "Adjust Window Frame and Window Level in PET Mode",
      component: BasicPETUseTool,
    },
  ],
};

const routes = [
  { path: "/", redirect: "/base/stack" },
  basicUsage,
  basicToolsUsage,
];

export default routes;
