import 'plugins/ming/ming.less';
import 'plugins/ming/ming_controller';
import 'plugins/ming/ming_vis_params';
import TemplateVisTypeTemplateVisTypeProvider from 'ui/template_vis_type/template_vis_type';
import VisSchemasProvider from 'ui/vis/schemas';
import mingCloudTemplate from 'plugins/ming/ming_controller.html';
import mingCloudParamsTemplate from 'plugins/ming/ming_vis_params.html';
import visTypes from 'ui/registry/vis_types';


visTypes.register(
 function MingCloudProvider(Private) {
   const TemplateVisType = Private(TemplateVisTypeTemplateVisTypeProvider);
   const Schemas = Private(VisSchemasProvider);
   return new TemplateVisType({
    name: 'ming',
    title: 'ming cloud',
    implementsRenderComplete: true,
    description: 'A d3.js representation of iPOC data metrix.',
    icon: 'fa-rocket',
    template: mingCloudTemplate,
    params: {
      defaults: {
        scale: 'linear',
        orientation: 'single',
        minFontSize: 18,
        maxFontSize: 72
      },
      scales: ['linear', 'log', 'square root'],
      orientations: ['single', 'right angled', 'multiple'],
      editor: mingCloudParamsTemplate
    },
    schemas: new Schemas([
      {
        group: 'metrics',
        name: 'metric',
        title: 'Size',
        min: 1,
        max: 1,
        aggFilter: ['!std_dev', '!percentiles', '!percentile_ranks', '!derivative'],
        defaults: [
          { schema: 'metric', type: 'count' }
        ]
      },
      {
        group: 'buckets',
        name: 'segment',
        icon: 'fa fa-rocket',
        title: 'Ming',
        min: 1,
        max: 1,
        aggFilter: ['terms']
      }
    ])
   });
 }
);

// export the provider so that the visType can be required with Private()
//export default MingCloudProvider;
