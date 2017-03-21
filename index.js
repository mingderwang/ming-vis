export default function (kibana) {
  return new kibana.Plugin(
    {
      uiExports: {
        visTypes: ['plugins/ming/ming_vis']
      }
    }
  );
}
