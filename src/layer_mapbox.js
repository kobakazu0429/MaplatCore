import Layer from "ol/layer/Layer";
import mapboxgl from "mapbox-gl";
import { toLonLat } from "ol/proj";

export class MapboxLayer extends Layer {
    constructor(options) {
        const mbMap = new mapboxgl.Map({
            style: options.style,
            accessToken: options.accessToken,
            attributionControl: false,
            boxZoom: false,
            center: options.center,
            //container: options.container,
            container: 'mapbox_div',
            doubleClickZoom: false,
            dragPan: false,
            dragRotate: false,
            interactive: false,
            keyboard: false,
            pitchWithRotate: false,
            scrollZoom: false,
            touchZoomRotate: false
        });
        const render = function(frameState) {
            const mbMap = this.mbMap;
            const canvas = mbMap.getCanvas();
            const viewState = frameState.viewState;

            const visible = this.getVisible();
            canvas.style.display = visible ? "block" : "none";

            const opacity = this.getOpacity();
            canvas.style.opacity = opacity;

            // adjust view parameters in mapbox
            const rotation = viewState.rotation;
            if (rotation) {
                mbMap.rotateTo((-rotation * 180) / Math.PI, {
                    animate: false
                });
            }
            mbMap.jumpTo({
                center: toLonLat(viewState.center),
                zoom: viewState.zoom - 1,
                animate: false
            });

            // cancel the scheduled update & trigger synchronous redraw
            // see https://github.com/mapbox/mapbox-gl-js/issues/7893#issue-408992184
            // NOTE: THIS MIGHT BREAK WHEN UPDATING MAPBOX
            if (mbMap._frame) {
                mbMap._frame.cancel();
                mbMap._frame = null;
            }
            mbMap._render();

            return canvas;
        };
        super({
            render,
            source: options.source
        });
        this.mbMap = mbMap;
    }

    remove() {
        this.mbMap.remove();
        delete this.mbMap;
    }
}