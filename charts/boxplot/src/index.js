import {
  useConstraints,
  useEffect,
  useElement,
  useModel,
  usePromise,
  useRect,
  useSelections,
  useState,
  useStaleLayout,
  useTheme,
  useTranslator,
} from '@nebula.js/stardust';
import picassojs from 'picasso.js';
import picassoQ from 'picasso-plugin-q';
import $ from 'jquery';

import properties from './object-properties';
import data from './data';
// import picSelections from './pic-selections';
// import definition from './pic-definition';
import ChartView from './boxplot-view';
import BackednAPi from './backend-api';

// onResize(layout, options) {
//   if (!this._paintCalled) {
//     return Deferred.resolve();
//   }
//   const view = this.view;
//   const $scope = this.$scope;
//   view.refreshSelections();
//   return Deferred.resolve()
//     .then(() => {
//       let element = view.$element;
//       if ($scope.ext.hasDefaultTemplate()) {
//         // Use the contained div as content - for extension backwards compatibility
//         element = element.children().first();
//       }
//       return view.resize(element, layout, options);
//     })
//     .catch((err) => {
//       if (process.env.NODE_ENV === 'development') {
//         if (typeof err !== 'undefined') {
//           console.error(err);
//         }
//       }
//     });
// },

export default function supernova(env) {
  const picasso = picassojs();
  picasso.use(picassoQ);

  return {
    qae: {
      properties,
      data,
    },
    component() {
      const element = useElement();
      const selections = useSelections();
      const layout = useStaleLayout();
      const rect = useRect();
      const model = useModel();
      // eslint-disable-next-line no-unused-vars
      const constraints = useConstraints();
      const translator = useTranslator();
      const theme = useTheme();

      const [instance, setInstance] = useState();

      useEffect(() => {
        const $scope = null;
        const $element = $(element);
        const options = null;
        const backendApi = new BackednAPi(model);
        const selectionsApi = selections;
        const tooltipApi = null;
        const view = new ChartView(
          env.flags,
          layout,
          picasso,
          translator,
          theme,
          $scope,
          $element,
          options,
          backendApi,
          selectionsApi,
          tooltipApi
        );

        // const p = picasso.chart({
        //   element,
        //   data: [],
        //   settings: {},
        // });

        // const s = picSelections({
        //   selections,
        //   brush: p.brush('selection'),
        //   picassoQ,
        // });

        setInstance(view);

        return () => {
          // s.release();
          view.destroy();
          // p.destroy();
        };
      }, []);

      const [, error] = usePromise(async () => {
        if (!instance) {
          return;
        }

        // TODO: confim selection if triggered from engine (another websocket to the same session (browser tab))
        // TODO: usingDerivedProperties

        await instance.updateData(layout);
        const $element = null;
        await instance.paint($element, layout);
        // instance.update({
        //   data: [
        //     {
        //       type: 'q',
        //       key: 'qHyperCube',
        //       data: layout.qHyperCube,
        //     },
        //   ],
        //   settings: definition({ layout, constraints }),
        // });
        // instance
      }, [layout, instance]);
      if (error) {
        throw error;
      }

      usePromise(async () => {
        if (!instance) {
          return;
        }
        const $element = null;
        await instance.resize($element, layout);
      }, [rect.width, rect.height]);
    },
  };
}
