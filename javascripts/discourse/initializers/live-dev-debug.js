export default {
  name: "live-dev-debug",
  initialize(container) {
    const messageBus = container.lookup("service:message-bus");
    const session = container.lookup("service:session");

    // -1 is implicit, that's what we want on production
    const lastFileChangeId = session.mbLastFileChangeId || -1;

    // Observe file changes
    messageBus.subscribe(
      "/file-change",
      (data) => {
        // eslint-disable-next-line no-console
        console.log("--------");
        data.forEach((me) => {
          if (me === "refresh") {
            // ?
          } else if (me.new_href && me.target) {
            // eslint-disable-next-line no-console
            console.log(me);
          }
        });
      },
      lastFileChangeId
    );
  },
};
