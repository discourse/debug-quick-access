import { isAppWebview } from "discourse/lib/utilities";
import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "debug-quick-access",

  initialize(container) {
    withPluginApi("0.11.5", (api) => {
      let currentUser = api.getCurrentUser();
      api.reopenWidget("quick-access-panel", {
        html(attrs, state) {
          console.log(state);
          if (isAppWebview() && currentUser?.username_lower === "pmusaraj") {
            alert(JSON.stringify(state));
          }
          return this._super(...arguments);
        },
      });
    });
  },
};
