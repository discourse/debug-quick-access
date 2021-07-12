import { isAppWebview } from "discourse/lib/utilities";
import { withPluginApi } from "discourse/lib/plugin-api";
import Session from "discourse/models/session";

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

          this.findNewItems().then((newItems) => {
            this.setItems(newItems)
              .catch((e) => {
                console.log(e);
                this.setItems([]);
              })
              .finally(() => {
                console.log("finally hit");
                state.loading = false;
                state.loaded = true;
                this.newItemsLoaded();
                this.sendWidgetAction("itemsLoaded", {
                  hasUnread: this.hasUnread(),
                  markRead: () => this.markRead(),
                });
                this.scheduleRerender();
              });
          });
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
