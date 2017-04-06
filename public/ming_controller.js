import _ from 'lodash';
import uiModules from 'ui/modules';
import MingCloud from 'plugins/ming/ming';
import AggConfigResult from 'ui/vis/agg_config_result';
import FilterBarFilterBarClickHandlerProvider from 'ui/filter_bar/filter_bar_click_handler';

const module = uiModules.get('kibana/ming', ['kibana']);
module.controller('KbnMingController', function ($scope, $element, Private, getAppState) {

    const containerNode = $element[0];
    console.log(containerNode);
    const filterBarClickHandler = Private(FilterBarFilterBarClickHandlerProvider);
    const maxTagCount = 200;
    let truncated = false;

    const ming = new MingCloud(containerNode);
    ming.on('select', (event) => {
      const appState = getAppState();
      const clickHandler = filterBarClickHandler(appState);
      const aggs = $scope.vis.aggs.getResponseAggs();
      const aggConfigResult = new AggConfigResult(aggs[0], false, event, event);
      clickHandler({ point: { aggConfigResult: aggConfigResult } });
    });
    ming.on('renderComplete', () => {

      const truncatedMessage = containerNode.querySelector('.ming-truncated-message');
      const incompleteMessage = containerNode.querySelector('.ming-incomplete-message');

      if (!$scope.vis.aggs[0] || !$scope.vis.aggs[1]) {
        incompleteMessage.style.display = 'none';
        truncatedMessage.style.display = 'none';
        return;
      }

      const bucketName = containerNode.querySelector('.ming-custom-label');
      bucketName.innerHTML = `${$scope.vis.aggs[0].makeLabel()} - ${$scope.vis.aggs[1].makeLabel()}`;


      truncatedMessage.style.display = truncated ? 'block' : 'none';


      const status = ming.getStatus();

      if (MingCloud.STATUS.COMPLETE === status) {
        incompleteMessage.style.display = 'none';
      } else if (MingCloud.STATUS.INCOMPLETE === status) {
        incompleteMessage.style.display = 'block';
      }


      $element.trigger('renderComplete');
    });

    $scope.$watch('esResponse', async function (response) {

      if (!response) {
        ming.setData([]);
        return;
      }

      const tagsAggId = _.first(_.pluck($scope.vis.aggs.bySchemaName.segment, 'id'));
      if (!tagsAggId || !response.aggregations) {
        ming.setData([]);
        return;
      }

      const metricsAgg = _.first($scope.vis.aggs.bySchemaName.metric);
      const buckets = response.aggregations[tagsAggId].buckets;

      const tags = buckets.map((bucket) => {
        return {
          text: bucket.key,
          value: getValue(metricsAgg, bucket)
        };
      });


      if (tags.length > maxTagCount) {
        tags.length = maxTagCount;
        truncated = true;
      } else {
        truncated = false;
      }

      ming.setData(tags);
    });


    $scope.$watch('vis.params', (options) => ming.setOptions(options));

    $scope.$watch(getContainerSize, _.debounce(() => {
      ming.resize();
    }, 1000, { trailing: true }), true);


    function getContainerSize() {
      return { width: $element.width(), height: $element.height() };
    }

    function getValue(metricsAgg, bucket) {
      let size = metricsAgg.getValue(bucket);
      if (typeof size !== 'number' || isNaN(size)) {
        try {
          size = bucket[1].values[0].value;//lift out first value (e.g. median aggregations return as array)
        } catch (e) {
          size = 1;//punt
        }
      }
      return size;
    }


  });
