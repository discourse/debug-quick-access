import { isAppWebview } from "discourse/lib/utilities";
import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "debug-quick-access",

  initialize(container) {
    withPluginApi("0.11.5", (api) => {
      let currentUser = api.getCurrentUser();
      const showError =
        isAppWebview() && currentUser?.username_lower === "pmusaraj";
      api.reopenWidget("quick-access-panel", {
        refreshNotifications(state) {
          if (state.loading) {
            return;
          }

          if (this.getItems().length === 0) {
            state.loading = true;
          }

          this.findNewItems().then((newItems) => this.setItems(newItems));
        },

        setItems(newItems) {
          Session.currentProp(`${this.key}-items`, newItems);
          console.log("custom quick-access-panel setItems with Promise");
          return Promise.resolve([]);
        },
      });

      api.reopenWidget("quick-access-notifications", {
        findNewItems() {
          return this._findStaleItemsInStore()
            .refresh()
            .catch((e) => {
              console.log("error in findNewItems");
              console.log(e);
            });
        },
      });
    });
  },
};
