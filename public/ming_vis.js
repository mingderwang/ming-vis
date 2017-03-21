import 'plugins/ming/ming.less';
import 'plugins/ming/ming_controller';
import 'plugins/ming/ming_vis_params';
import TemplateVisTypeTemplateVisTypeProvider from 'ui/template_vis_type/template_vis_type';
import VisSchemasProvider from 'ui/vis/schemas';
import tagCloudTemplate from 'plugins/ming/ming_controller.html';
import visTypes from 'ui/registry/vis_types';

visTypes.register(
 function TagCloudProvider(Private) {
   const TemplateVisType = Private(TemplateVisTypeTemplateVisTypeProvider);
   return new TemplateVisType({
    name: 'ming',
    title: 'ming cloud',
    implementsRenderComplete: true,
    description: 'a visual representation of iPOC data.',
    icon: 'fa-cloud',
    template: tagCloudTemplate,
    
   });
 }
);
