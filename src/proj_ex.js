import {
  getTransform,
  identityTransform,
  transform,
  addCoordinateTransforms
} from "ol/proj";

// Direct transforamation between 2 projection
export function transformDirect(xy, src, dist) {
  if (!dist) {
    dist = src;
    src = xy;
    xy = null;
  }
  const srcCode = src.getCode ? src.getCode() : src;
  const distCode = dist.getCode ? dist.getCode() : dist;
  let func = getTransform(src, dist);
  if (func == identityTransform && srcCode != distCode) {
    const srcFunc = getTransform(src, "EPSG:3857");
    const distFunc = getTransform("EPSG:3857", dist);
    if (srcFunc == identityTransform && srcCode != "EPSG:3857")
      throw "Transform of Source projection is not defined.";
    if (distFunc == identityTransform && distCode != "EPSG:3857")
      throw "Transform of Distination projection is not defined.";
    func = function (xy) {
      return transform(transform(xy, src, "EPSG:3857"), "EPSG:3857", dist);
    };
    const invFunc = function (xy) {
      return transform(transform(xy, dist, "EPSG:3857"), "EPSG:3857", src);
    };
    addCoordinateTransforms(src, dist, func, invFunc);
  }

  if (xy) return func(xy);
}
