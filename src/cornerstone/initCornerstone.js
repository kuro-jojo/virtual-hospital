import {
  Enums as csEnums,
  init as csRenderInit,
  setUseSharedArrayBuffer,
} from "@cornerstonejs/core";
import { init as csToolsInit } from "@cornerstonejs/tools";
import initProviders from "./initProviders";
import initCornerstoneDICOMImageLoader from "./initCornerstoneDicomImageLoader";
import initVolumeLoader from "./initVolumeLoader";

export default async function initCornerstone() {
  initProviders();

  initCornerstoneDICOMImageLoader();

  initVolumeLoader();

  await csRenderInit({
    gpuTier: false,
  });

  csToolsInit();

  setUseSharedArrayBuffer(csEnums.SharedArrayBufferModes.AUTO);
}
