import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "debug-quick-access",

  initialize(container) {
    withPluginApi("0.11.5", (api) => {
      api.reopenWidget("quick-access-panel", {
        html(attrs, state) {
          console.log(state);
          return this._super(...arguments);
        },
      });
    });
  },
};
