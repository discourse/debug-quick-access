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
        html(attrs, state) {
          if (showError) {
            alert(JSON.stringify(state));
          }
          return this._super(...arguments);
        },

        refreshNotifications(state) {
          if (showError) {
            alert("hitting refreshNotifications");
          }
          if (state.loading) {
            return;
          }

          if (this.getItems().length === 0) {
            state.loading = true;
          }

          this.findNewItems()
            .then((newItems) => this.setItems(newItems))
            .catch((error) => {
              // eslint-disable-next-line no-console
              console.error(error);
              if (showError) {
                alert(JSON.stringify(error));
              }
              return this.setItems([]);
            })
            .finally(() => {
              state.loading = false;
              state.loaded = true;
              this.newItemsLoaded();
              this.sendWidgetAction("itemsLoaded", {
                hasUnread: this.hasUnread(),
                markRead: () => this.markRead(),
              });
              this.scheduleRerender();
            });
        },
      });
    });
  },
};
