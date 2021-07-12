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
        setItems(newItems) {
          if (showError) {
            alert("setItems: " + JSON.stringify(newItems) + " " + this.key);
          }
          return this._super(...arguments);
        },

        refreshNotifications(state) {
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
              // console.error(error);
              // if (showError) {
              //   alert("error in findNewItems: " + JSON.stringify(error));
              // }
              // this.setItems([]);
              // do nothing
            })
            .finally(() => {
              if (showError) {
                alert("finally in refreshNotifs hit");
              }
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

      api.reopenWidget("quick-access-notifications", {
        findNewItems() {
          if (showError) {
            alert("findNewItems hit");
          }
          const staleItems = this.store.findStale(
            "notification",
            {
              recent: true,
              silent: this.currentUser.enforcedSecondFactor,
              limit: 30,
            },
            { cacheKey: "recent-notifications" }
          );
          if (showError) {
            alert("staleItems: " + JSON.stringify(staleItems));
          }
          return staleItems.refresh();
        },
      });
    });
  },
};
